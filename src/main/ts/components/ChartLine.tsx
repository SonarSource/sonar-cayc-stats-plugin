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
import styled from '@emotion/styled';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { curveBasis, line } from 'd3-shape';
import { t as translate } from 'i18n';
import React from 'react';

interface Props {
  data: Array<{ x: Date; y: number }>;
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  chartEndDate: Date;
  projection?: boolean;
}

export default function ChartLine({
  data,
  xScale,
  yScale,
  chartEndDate,
  projection = false,
}: Props) {
  const lineGenerator = line<{ x: Date; y: number }>()
    .defined((d) => Boolean(d.y || d.y === 0))
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  lineGenerator.curve(curveBasis);

  const format = yScale.tickFormat(undefined, '~s');

  const nowX = xScale(chartEndDate);
  const y = yScale(data[data.length - 1].y);

  return (
    <g>
      <Line
        d={lineGenerator(data) || undefined}
        style={{ stroke: projection ? '#6cd46c' : '#f0878e' }}
        data-testid={projection ? 'cayc-projection-data' : null}
      />
      <Border
        width={130}
        height={20}
        x={nowX + 5}
        y={y - 15}
        style={{
          fill: projection ? '#6cd46c' : 'none',
          stroke: projection ? '#6cd46c' : '#f0878e',
        }}
      />
      <text x={nowX} y={y} dx={10}>
        {projection ? translate('cayc.chart.with_cayc') : translate('cayc.chart.current_state')}
      </text>
      <text
        aria-label={projection ? 'Projected issues count' : 'Current issues count'}
        x={nowX}
        y={y}
        dx={152}
      >
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
