/*
 * Copyright (C) 2022-2022 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import { extent } from "d3-array";
import { scaleLinear, ScaleLinear, scaleTime, ScaleTime } from "d3-scale";
import { differenceInMonths, isSameMonth, subYears } from "date-fns";
import { useEffect, useState } from "react";
import { getIssues } from "../api";
import { CAYC_PERIOD, HEIGHT, WIDTH } from "../constants";

const NOISE_CAP = 0.05;
const Q = 0.2;
const PROJECTION_TIME = 24; // months

/*
 * proportion of issues fixed by code churn
 * Based on
 */
function churn(t: number) {
  return 1 - Q * (1 - Math.pow(1 - Q, t / 12));
}

function noise(
  t: number,
  y: number,
  startPoint: { x: Date; y: number },
  endPoint: { x: Date; y: number }
) {
  const slope = (endPoint.y - startPoint.y) / PROJECTION_TIME;

  const shift = startPoint.y;

  const linearProjection = slope * t + shift;

  return 1 + Math.min((y - linearProjection) / linearProjection, NOISE_CAP);
}

function generateProjection(data: Array<{ x: Date; y: number }>) {
  const startingDate = subYears(new Date(), CAYC_PERIOD);

  const startingPointIndex = data.findIndex(({ x }) => isSameMonth(x, startingDate));

  if (startingPointIndex === -1) {
    return [];
  }

  const startingPoint = data[startingPointIndex];
  return data.slice(startingPointIndex).map(({ x, y }) => {
    const t = differenceInMonths(x, startingPoint.x);

    const result = startingPoint.y * churn(t) * noise(t, y, startingPoint, data[data.length - 1]);

    return { x, y: Math.round(result) };
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
      // const maxYValue = max(cumulative.map(({ y }) => y)) ?? 1;
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
