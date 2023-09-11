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
import { Values, getIssues } from '../api';

function getFacetValues(values: Values) {
  return {
    facets: [
      {
        values: [values],
      },
    ],
  };
}

jest.mock(
  'sonar-request',
  () => ({
    getJSON: jest
      .fn()
      .mockResolvedValueOnce(getFacetValues({ val: '2022-01-01', count: 0 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2021-01-01', count: 0 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2020-01-01', count: 0 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2019-01-01', count: 0 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2018-01-01', count: 0 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2017-01-01', count: 0 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2016-01-01', count: 0 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2015-01-01', count: 0 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2014-01-01', count: 0 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2013-01-01', count: 0 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2012-01-01', count: 3 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2011-01-01', count: 4 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2010-01-01', count: 7 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2009-01-01', count: 3 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2008-01-01', count: 3 }))
      .mockResolvedValueOnce(getFacetValues({ val: '2007-01-01', count: 1 })),
  }),
  { virtual: true }
);

it('should return chart data', async () => {
  const result = await getIssues();
  expect(result).toEqual([
    {
      x: new Date('2012-01-01T00:00:00.000Z'),
      y: 3,
    },
    {
      x: new Date('2011-01-01T00:00:00.000Z'),
      y: 4,
    },
    {
      x: new Date('2010-01-01T00:00:00.000Z'),
      y: 7,
    },
    {
      x: new Date('2009-01-01T00:00:00.000Z'),
      y: 3,
    },
    {
      x: new Date('2008-01-01T00:00:00.000Z'),
      y: 3,
    },
  ]);
});
