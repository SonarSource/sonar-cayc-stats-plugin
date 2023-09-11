/*
 * Clean as You Code Plugin
 * Copyright (C) 2022-2023 SonarSource SA
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
import { getJSON } from 'sonar-request';

const MAX_YEARS = 15;

export interface Values {
  val: string;
  count: number;
}

interface Response {
  facets: Array<{ values: Values[] }>;
}

const getDateMinusYears = (years: number) => {
  const date = new Date();
  const fixedTimezoneDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
  fixedTimezoneDate.setFullYear(fixedTimezoneDate.getFullYear() - years);
  return fixedTimezoneDate;
};

const makeRequest = (date: Date) =>
  getJSON('/api/issues/search', {
    createdAfter: format(subYears(date, 1), 'yyyy-MM-dd'),
    createdBefore: format(date, 'yyyy-MM-dd'),
    types: 'BUG,VULNERABILITY',
    resolved: 'false',
    facets: 'createdAt',
  }).then(({ facets }: Response) => facets[0].values);

export function getIssues() {
  const promises = [];
  for (let i = MAX_YEARS - 1; i >= 0; i--) {
    const date = getDateMinusYears(i);
    promises.push(makeRequest(date));
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
