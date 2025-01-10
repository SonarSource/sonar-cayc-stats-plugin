/*
 * Clean as You Code Plugin
 * Copyright (C) 2022-2025 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import format from 'date-fns/format';
import subYears from 'date-fns/subYears';
import { getJSON, throwGlobalError } from 'sonar-request';

const MAX_YEARS = 15;

export interface Values {
  val: string;
  count: number;
}

interface Response {
  facets: Array<{ values: Values[] }>;
}

interface IssuesRequestData {
  createdAfter: string;
  createdBefore: string;
  types: string;
  resolved: string;
  facets: string;
  components?: string;
  componentKeys?: string;
}

export interface Component {
  key: string;
  lastAnalysisDate: string;
  managed: boolean;
  name: string;
  qualifier: string;
  revision: string;
  visibility: string;
}

const getDateMinusYears = (years: number) => {
  const date = new Date();
  const fixedTimezoneDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
  fixedTimezoneDate.setFullYear(fixedTimezoneDate.getFullYear() - years);
  return fixedTimezoneDate;
};

const buildIssuesRequest = (date: Date, selectedProjects?: string) => {
  const data: IssuesRequestData = {
    createdAfter: format(subYears(date, 1), 'yyyy-MM-dd'),
    createdBefore: format(date, 'yyyy-MM-dd'),
    types: 'BUG,VULNERABILITY',
    resolved: 'false',
    facets: 'createdAt',
  };
  if (selectedProjects) {
    data.components = selectedProjects;
    data.componentKeys = selectedProjects;
  }
  return getJSON('/api/issues/search', data).then(({ facets }: Response) => facets[0].values);
};

export function getIssues(selectedProject?: string) {
  const promises = [];
  for (let i = MAX_YEARS - 1; i >= 0; i--) {
    const date = getDateMinusYears(i);
    promises.push(buildIssuesRequest(date, selectedProject));
  }

  let found = false;
  const chartData: { x: Date; y: number }[] = [];
  return Promise.all(promises).then((results) => {
    results.forEach((values) => {
      const total = values.reduce((acc, { count }) => acc + count, 0);
      if (found || total > 0) {
        found = true;
        values.forEach(({ val, count }) => {
          chartData.push({
            x: new Date(Date.parse(val)),
            y: count,
          });
        });
      }
    });
    return chartData;
  });
}

export function getProjects(nameFilter: string) {
  return getJSON(
    '/api/components/search_projects',
    nameFilter ? { filter: `query = "${nameFilter}"` } : undefined,
  )
    .then(({ components }: { components: Component[] }) => components)
    .catch((error) => {
      throwGlobalError(error);
      return [];
    });
}
