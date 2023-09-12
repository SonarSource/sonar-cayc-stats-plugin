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
import { screen } from '@testing-library/react';
import React from 'react';
import selectEvent from 'react-select-event';
import { byRole, byTestId } from 'testing-library-selector';
import { getIssues } from '../../api';
import { renderComponent } from '../../testHelpers';
import CleanAsYouCode from '../CleanAsYouCode';

function getHistoryEntry(y = 20) {
  const { subMonths } = jest.requireActual('date-fns');
  const history = [];
  for (let i = 0; i < 36; i++) {
    history.push({
      x: subMonths(new Date(), i),
      y,
    });
  }
  return history;
}

jest.mock('../../api', () => {
  const history = getHistoryEntry(20);
  return {
    getIssues: jest.fn().mockResolvedValue(history),
    getProjects: jest.fn().mockResolvedValue([
      {
        key: 'project1',
        name: 'Project 1',
      },
      {
        key: 'project2',
        name: 'Project 2',
      },
    ]),
  };
});

const ui = {
  periodSelect: byRole('combobox', { name: 'cayc.period_select.label' }),
  projectSelect: byRole('combobox', { name: 'cayc.project_select.label' }),
  projectionCurve: byTestId('cayc-projection-data'),
  projectedIssueCount: byTestId('projected-issue-count'),
};

it('should render correctly', async () => {
  renderComponent(<CleanAsYouCode />);

  expect(await screen.findByText('cayc.title')).toBeInTheDocument();
  expect(screen.getByText('cayc.description.intro')).toBeInTheDocument();
  expect(screen.getByText('cayc.description.history')).toBeInTheDocument();
  expect(screen.getByText('cayc.description.principles.intro')).toBeInTheDocument();
  expect(screen.getByText('cayc.description.principles.cost')).toBeInTheDocument();
  expect(screen.getByText('cayc.description.principles.optimization')).toBeInTheDocument();
  expect(screen.getByText('cayc.description.principles.leak')).toBeInTheDocument();
  expect(screen.getByText('cayc.description.principles.impact')).toBeInTheDocument();
  expect(screen.getByText('cayc.description.demo_intro')).toBeInTheDocument();
  expect(screen.getByTestId('cayc-illustration')).toHaveAttribute(
    'src',
    '/myBaseUrl/static/cayc/images/CaYC.svg',
  );
  expect(screen.getByText('cayc.chart.title')).toBeInTheDocument();
});

it('should render correctly without any data', async () => {
  jest.mocked(getIssues).mockResolvedValueOnce([]);
  renderComponent(<CleanAsYouCode />);

  expect(await screen.findByText('cayc.no_data')).toBeInTheDocument();
});

it('should render correctly when data fetch failed', async () => {
  jest.mocked(getIssues).mockRejectedValueOnce({
    errors: [{ msg: 'An error has occurred. Please contact your administrator' }],
  });
  renderComponent(<CleanAsYouCode />);

  expect(await screen.findByText('cayc.request_failed')).toBeInTheDocument();
});

it('should properly render the projection curve', async () => {
  renderComponent(<CleanAsYouCode />);

  expect(await screen.findByText('cayc.chart.title')).toBeInTheDocument();

  expect(ui.projectedIssueCount.get()).toHaveTextContent('0.6k issues');

  await selectEvent.select(ui.periodSelect.get(), 'cayc.chart.title.period_option.6 months');

  expect(ui.projectedIssueCount.get()).toHaveTextContent('0.2k issues');

  const history1 = getHistoryEntry(2);
  jest.mocked(getIssues).mockResolvedValueOnce(history1);

  await selectEvent.select(ui.projectSelect.get(), 'Project 2');

  expect(ui.projectedIssueCount.get()).toHaveTextContent('61 issues');

  const history2 = getHistoryEntry(3);
  jest.mocked(getIssues).mockResolvedValueOnce(history2);

  await selectEvent.select(ui.projectSelect.get(), 'Project 1');

  expect(ui.projectedIssueCount.get()).toHaveTextContent('92 issues');
});
