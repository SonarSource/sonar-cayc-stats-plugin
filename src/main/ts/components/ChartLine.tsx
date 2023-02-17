/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import styled from '@emotion/styled';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { curveBasis, line } from 'd3-shape';
import { t } from 'i18n';
import React from 'react';

interface Props {
  data: Array<{ x: Date; y: number }>;
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  projection?: boolean;
}

export default function ChartLine({ data, xScale, yScale, projection = false }: Props) {
  const lineGenerator = line<{ x: Date; y: number }>()
    .defined((d) => Boolean(d.y || d.y === 0))
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  lineGenerator.curve(curveBasis);

  const format = yScale.tickFormat(undefined, '~s');

  const nowX = xScale(new Date());

  return (
    <g>
      <Line
        d={lineGenerator(data) || undefined}
        style={{ stroke: projection ? '#6cd46c' : '#f0878e' }}
      />
      <Border
        width={130}
        height={20}
        x={nowX + 4}
        y={yScale(data[data.length - 1].y)}
        style={{
          fill: projection ? '#6cd46c' : 'none',
          stroke: projection ? '#6cd46c' : '#f0878e',
        }}
      />
      <text x={nowX} y={yScale(data[data.length - 1].y)} dx={12} dy={14}>
        {projection ? t('cayc.chart.with_cayc') : t('cayc.chart.current_state')}
      </text>
      <text x={nowX} dx={152} dy={14} y={yScale(data[data.length - 1].y)}>
        {format(data[data.length - 1].y)} issues
      </text>
    </g>
  );
}

const Line = styled.path({
  fill: 'none',
  strokeWidth: '3px',
});

const Border = styled.rect({
  strokeWidth: '1px',
  position: 'relative',
});
