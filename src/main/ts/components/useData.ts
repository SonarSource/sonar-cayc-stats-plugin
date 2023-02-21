/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import { extent } from 'd3-array';
import { scaleLinear, ScaleLinear, scaleTime, ScaleTime } from 'd3-scale';
import { sub, subMonths } from 'date-fns';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getIssues } from '../api';
import { GRAPH_HEIGHT, GRAPH_WIDTH } from '../constants';
import { durationToMonths, generateCaycProjectionData } from './utils';

interface UseDataReturn {
  loading: boolean;
  cumulativeData: Array<{ x: Date; y: number }>;
  caycProjectionData: Array<{ x: Date; y: number }>;
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  caycAvailableDurations: AvailableDuration[];
  currentCaycDuration: AvailableDuration | undefined;
  setCurrentCaycDuration: Dispatch<SetStateAction<AvailableDuration>>;
  caycStartingDate: Date;
  chartStartingDate: Date;
  chartEndDate: Date;
}

const CAYC_DURATIONS: Duration[] = [
  { months: 6 },
  { years: 1 },
  { years: 2 },
  { years: 5 },
  { years: 10 },
];

export interface AvailableDuration {
  duration: Duration;
  value: number;
}

export default function useData(): UseDataReturn {
  const [loading, setLoading] = useState(true);
  const [cumulativeData, setCumulativeData] = useState<Array<{ x: Date; y: number }>>([]);
  const [xScale, setXScale] = useState<ScaleTime<number, number>>(scaleTime());
  const [yScale, setYScale] = useState<ScaleLinear<number, number>>(scaleLinear());
  const [caycAvailableDurations, setCaycAvailableDurations] = useState<AvailableDuration[]>([]);
  const [currentCaycDuration, setCurrentCaycDuration] = useState<AvailableDuration>();
  const [caycProjectionData, setCaycProjectionData] = useState<Array<{ x: Date; y: number }>>([]);
  const [caycStartingDate, setCaycStartingDate] = useState<Date>(new Date());
  const [chartDateRange, setChartDateRange] = useState<[Date, Date]>([new Date(), new Date()]);

  useEffect(() => {
    (async () => {
      const issueRepartitionData = await getIssues();

      let cumulativeIssueCount = 0;
      const cumulativeData = issueRepartitionData.map(({ x, y }) => {
        cumulativeIssueCount += y;
        return {
          x,
          y: cumulativeIssueCount,
        };
      });

      setCumulativeData(cumulativeData);

      // x scale
      const dateRange = extent(cumulativeData, (d) => d.x) as [Date, Date];
      const timeScale = scaleTime().range([0, GRAPH_WIDTH]).domain(dateRange).clamp(false);
      setXScale(() => timeScale);
      setChartDateRange(dateRange);

      // y scale
      const linearScale = scaleLinear()
        .range([GRAPH_HEIGHT - 16, 0])
        .domain([0, cumulativeIssueCount * 1.5])
        .nice();
      setYScale(() => linearScale);

      // cayc available periods
      const [chartStartDate, chartEndDate] = dateRange;
      const caycAvailablePeriods = CAYC_DURATIONS.filter(
        (duration) => chartStartDate < sub(chartEndDate, duration)
      ).map((duration, i) => ({ duration, value: i }));
      setCaycAvailableDurations(caycAvailablePeriods);
      setCurrentCaycDuration(caycAvailablePeriods[caycAvailablePeriods.length - 1]);

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (() => {
      const [_chartStartDate, chartEndDate] = chartDateRange;
      const caycStartingDate = subMonths(
        chartEndDate,
        durationToMonths(currentCaycDuration?.duration)
      );
      setCaycStartingDate(caycStartingDate);
      setCaycProjectionData(generateCaycProjectionData(cumulativeData, caycStartingDate));
    })();
  }, [cumulativeData, chartDateRange, currentCaycDuration]);

  return {
    loading,
    cumulativeData,
    caycProjectionData,
    xScale,
    yScale,
    caycAvailableDurations,
    currentCaycDuration,
    setCurrentCaycDuration,
    caycStartingDate,
    chartStartingDate: chartDateRange[0],
    chartEndDate: chartDateRange[1],
  };
}
