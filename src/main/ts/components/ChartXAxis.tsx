/*
 * Copyright (C) 2022-2022 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import { ScaleTime } from 'd3-scale';
import React from 'react';

interface Props {
  xScale: ScaleTime<number, number>;
}

export default function ChartXAxis({ xScale }: Props) {
  const format = xScale.tickFormat(4);
  const ticks = xScale.ticks(4);

  return (
    <g>
      {ticks.map((t) => {
        return (
          <text key={t.getTime()} textAnchor="middle" x={xScale(t)} y={16}>
            {format(t)}
          </text>
        );
      })}
    </g>
  );
}
