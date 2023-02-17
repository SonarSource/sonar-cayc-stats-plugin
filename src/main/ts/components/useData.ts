/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import { extent } from 'd3-array';
import { scaleLinear, ScaleLinear, scaleTime, ScaleTime } from 'd3-scale';
import { differenceInMonths, isSameMonth, subMonths } from 'date-fns';
import { useEffect, useState } from 'react';
import { getIssues } from '../api';
import { CAYC_PERIOD_IN_MONTHS, GRAPH_HEIGHT, GRAPH_WIDTH } from '../constants';

interface UseDataReturn {
  loading: boolean;
  data: Array<{ x: Date; y: number }>;
  projection: Array<{ x: Date; y: number }>;
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  originDate: Date;
  caycStartingDate: Date;
  nowDate: Date;
}

function computeIssuesDecayForCaycPeriod(initialIssuesCount: number, caycPeriodInMonths: number) {
  // 20% fewer issues per year:
  return initialIssuesCount * Math.pow(Math.pow(1 - 0.2, 1 / 12), caycPeriodInMonths);
}

function generateProjection(data: Array<{ x: Date; y: number }>, caycStartingDate: Date) {
  const caycStartingPointIndex = data.findIndex(({ x }) => isSameMonth(x, caycStartingDate));

  const caycStartingPoint = caycStartingPointIndex > -1 ? data[caycStartingPointIndex] : data[0];

  return data.slice(caycStartingPointIndex).map(({ x }) => {
    const caycPeriodInMonths = differenceInMonths(x, caycStartingPoint.x);

    const issuesCount = computeIssuesDecayForCaycPeriod(caycStartingPoint.y, caycPeriodInMonths);

    return { x, y: Math.round(issuesCount) };
  });
}

export default function useData(): UseDataReturn {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Array<{ x: Date; y: number }>>([]);
  const [projection, setProjection] = useState<Array<{ x: Date; y: number }>>([]);
  const [xScale, setXScale] = useState<ScaleTime<number, number>>(scaleTime());
  const [yScale, setYScale] = useState<ScaleLinear<number, number>>(scaleLinear());
  const [originDate, setOriginDate] = useState<Date>(new Date());
  const [caycStartingDate, setCaycStartingDate] = useState<Date>(new Date());
  const [nowDate, setNowDate] = useState<Date>(new Date());

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

      const caycStart = subMonths(cumulative[cumulative.length - 1].x, CAYC_PERIOD_IN_MONTHS);
      setOriginDate(cumulative[0].x);
      setCaycStartingDate(caycStart);
      setNowDate(cumulative[cumulative.length - 1].x);
      setData(cumulative);
      setProjection(generateProjection(cumulative, caycStart));

      // x scale
      const dateRange = extent(cumulative, (d) => d.x) as [Date, Date];
      const timeScale = scaleTime().range([0, GRAPH_WIDTH]).domain(dateRange).clamp(false);
      setXScale(() => timeScale);

      // y scale
      const linearScale = scaleLinear()
        .range([GRAPH_HEIGHT - 16, 0])
        .domain([0, total * 1.5])
        .nice();
      setYScale(() => linearScale);

      setLoading(false);
    })();
  }, []);

  return { loading, data, projection, xScale, yScale, originDate, caycStartingDate, nowDate };
}
