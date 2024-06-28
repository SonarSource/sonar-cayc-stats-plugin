/*
 * Clean as You Code Plugin
 * Copyright (C) 2022-2024 SonarSource SA
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
import { differenceInMonths, isSameMonth, monthsInYear } from 'date-fns';
import { CAYC_DECAY_PER_YEAR } from '../constants';

export function durationToMonths(duration?: Duration) {
  if (!duration) {
    return 0;
  }
  return (duration?.months ?? 0) + (duration?.years ?? 0) * monthsInYear;
}

export function computeIssuesDecayForCaycPeriod(
  initialIssuesCount: number,
  caycPeriodInMonths: number,
) {
  return initialIssuesCount * Math.pow(1 - CAYC_DECAY_PER_YEAR, caycPeriodInMonths / monthsInYear);
}

export function generateCaycProjectionData(
  data: Array<{ x: Date; y: number }>,
  caycStartingDate: Date,
) {
  const caycStartingPointIndex = data.findIndex(({ x }) => isSameMonth(x, caycStartingDate));

  const caycStartingPoint = caycStartingPointIndex > -1 ? data[caycStartingPointIndex] : data[0];

  return data.slice(caycStartingPointIndex).map(({ x, y }) => {
    const caycPeriodInMonths = differenceInMonths(x, caycStartingPoint.x);

    const issuesCount = computeIssuesDecayForCaycPeriod(caycStartingPoint.y, caycPeriodInMonths);

    return { x, y: Math.round(issuesCount) };
  });
}
