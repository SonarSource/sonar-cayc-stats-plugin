/*
 * Clean as You Code Plugin
 * Copyright (C) 2022-2025 SonarSource Sàrl
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
import React from 'react';
import { GRAPH_VERTICAL_LABEL_LEFT_MARGIN, GRAPH_VERTICAL_LABEL_Y_BASE_OFFSET } from '../constants';
import Line from './Line';
import VerticalLine from './VerticalLine';

interface ChartVerticalLabelProps {
  label: string;
  labelYOffsetLevel: number;
  x: number;
}

export default function ChartVerticalLabel(props: ChartVerticalLabelProps) {
  const { label, labelYOffsetLevel, x } = props;
  const textY = -GRAPH_VERTICAL_LABEL_Y_BASE_OFFSET * labelYOffsetLevel;

  return (
    <g>
      <text dominantBaseline="middle" x={x + GRAPH_VERTICAL_LABEL_LEFT_MARGIN} y={textY}>
        {label}
      </text>
      <VerticalLine thin={true} length={-textY} x={x} y={textY} />
      <Line
        thin={true}
        x1={x}
        x2={x + GRAPH_VERTICAL_LABEL_LEFT_MARGIN * (2 / 3)}
        y1={textY}
        y2={textY}
      />
    </g>
  );
}
