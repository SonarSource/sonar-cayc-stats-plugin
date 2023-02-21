/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
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
  caycPeriodInMonths: number
) {
  return (
    initialIssuesCount *
    Math.pow(Math.pow(1 - CAYC_DECAY_PER_YEAR, 1 / monthsInYear), caycPeriodInMonths)
  );
}

export function generateCaycProjectionData(
  data: Array<{ x: Date; y: number }>,
  caycStartingDate: Date
) {
  const caycStartingPointIndex = data.findIndex(({ x }) => isSameMonth(x, caycStartingDate));

  const caycStartingPoint = caycStartingPointIndex > -1 ? data[caycStartingPointIndex] : data[0];

  return data.slice(caycStartingPointIndex).map(({ x, y }) => {
    const caycPeriodInMonths = differenceInMonths(x, caycStartingPoint.x);

    const issuesCount = computeIssuesDecayForCaycPeriod(caycStartingPoint.y, caycPeriodInMonths);

    return { x, y: Math.round(issuesCount) };
  });
}
