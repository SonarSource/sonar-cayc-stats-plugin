/*
 * Copyright (C) 2022-2022 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import { extent } from 'd3-array';
import { scaleLinear, ScaleLinear, scaleTime, ScaleTime } from 'd3-scale';
import { differenceInMonths, isSameMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { getIssues } from '../api';
import { HEIGHT, WIDTH } from '../constants';
import { computeCaycStartingDate } from './utils';

function computeIssuesDecayForCaycPeriod(initialIssuesCount: number, caycPeriodInMonths: number) {
  // 20% fewer issues per year:
  return initialIssuesCount * Math.pow(Math.pow(1 - 0.2, 1 / 12), caycPeriodInMonths)
}

function generateProjection(data: Array<{ x: Date; y: number }>) {
  const caycStartingDate = computeCaycStartingDate();

  const caycStartingPointIndex = data.findIndex(({ x }) => isSameMonth(x, caycStartingDate));

  const caycStartingPoint = caycStartingPointIndex > -1 ? data[caycStartingPointIndex] : data[0];

  return data.slice(caycStartingPointIndex).map(({ x, y }) => {
    const caycPeriodInMonths = differenceInMonths(x, caycStartingPoint.x);

    const issuesCount = computeIssuesDecayForCaycPeriod(caycStartingPoint.y, caycPeriodInMonths);

    return { x, y: Math.round(issuesCount) };
  });
}

export default function useData(): [
  boolean,
  Array<{ x: Date; y: number }>,
  Array<{ x: Date; y: number }>,
  ScaleTime<number, number>,
  ScaleLinear<number, number>
] {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Array<{ x: Date; y: number }>>([]);
  const [projection, setProjection] = useState<Array<{ x: Date; y: number }>>([]);
  const [xScale, setXScale] = useState<ScaleTime<number, number>>(scaleTime());
  const [yScale, setYScale] = useState<ScaleLinear<number, number>>(scaleLinear());

  useEffect(() => {
    (async () => {
      const result = await getIssues();

      let total = 0;
      const cumulative = result.map(({ x, y }) => {
        total += y;
        return {
          x,
          y: total,
        };
      });

      setData(cumulative);
      setProjection(generateProjection(cumulative));

      // x scale
      const dateRange = extent(cumulative, (d) => d.x) as [Date, Date];
      const timeScale = scaleTime().range([0, WIDTH]).domain(dateRange).clamp(false);
      setXScale(() => timeScale);

      // y scale
      const linearScale = scaleLinear()
        .range([HEIGHT - 16, 0])
        .domain([0, total * 1.5])
        .nice();
      setYScale(() => linearScale);

      setLoading(false);
    })();
  }, []);

  return [loading, data, projection, xScale, yScale];
}
