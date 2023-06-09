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
import { ScaleTime } from 'd3-scale';
import React from 'react';
import { GRAPH_HEIGHT, GRAPH_VERTICAL_MARKER_Y_POSITION_OFFSET } from '../constants';

interface Props {
  xScale: ScaleTime<number, number>;
  date: Date;
  dash?: boolean;
  label: string;
  displayLabelBelow?: boolean;
}

export default function ChartVerticalMarker({
  xScale,
  date,
  dash = false,
  label,
  displayLabelBelow = false,
}: Props) {
  const markerLocation = xScale(date);
  return (
    <g>
      <text
        textAnchor="middle"
        x={markerLocation}
        y={
          displayLabelBelow
            ? GRAPH_HEIGHT + GRAPH_VERTICAL_MARKER_Y_POSITION_OFFSET + 5
            : -GRAPH_VERTICAL_MARKER_Y_POSITION_OFFSET
        }
      >
        {label}
      </text>
      <VerticalMarker
        x1={markerLocation}
        x2={markerLocation}
        y1={0}
        y2={GRAPH_HEIGHT}
        dash={dash}
      />
    </g>
  );
}

const VerticalMarker = styled.line((props: { dash?: boolean }) => ({
  stroke: '#c3c3c3',
  strokeWidth: '2px',
  strokeDasharray: props.dash ? '4,6' : '',
}));
