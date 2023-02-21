/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */

import { Duration } from 'date-fns';
import { durationToMonths, generateCaycProjectionData } from '../utils';

it.each([
  [{}, 0],
  [{ months: 6 }, 6],
  [{ years: 1 }, 12],
  [{ years: 2 }, 24],
  [{ years: 5 }, 60],
  [{ years: 10 }, 120],
])('should convert duration to months properly', (duration: Duration, result: number) => {
  expect(durationToMonths(duration)).toEqual(result);
});

it('should compute issue decay properly', () => {
  expect(
    generateCaycProjectionData(
      [
        { x: new Date(2020, 1, 1), y: 1000 },
        { x: new Date(2020, 2, 1), y: 2000 },
        { x: new Date(2020, 3, 1), y: 3000 },
        { x: new Date(2020, 4, 1), y: 4000 },
        { x: new Date(2020, 5, 1), y: 5000 },
        { x: new Date(2020, 6, 1), y: 6000 },
      ] as Array<{ x: Date; y: number }>,
      new Date(2020, 2, 1)
    )
  ).toEqual([
    { x: new Date(2020, 2, 1), y: 2000 },
    { x: new Date(2020, 3, 1), y: 1963 },
    { x: new Date(2020, 4, 1), y: 1927 },
    { x: new Date(2020, 5, 1), y: 1891 },
    { x: new Date(2020, 6, 1), y: 1857 },
  ]);
});
