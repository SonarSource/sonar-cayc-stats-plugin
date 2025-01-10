/*
 * Clean as You Code Plugin
 * Copyright (C) 2022-2025 SonarSource SA
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
import { ScaleTime } from 'd3-scale';
import React from 'react';
import { GRAPH_HEIGHT } from '../constants';
import ChartVerticalLabel from './ChartVerticalLabel';
import VerticalLine from './VerticalLine';

interface Props {
  xScale: ScaleTime<number, number>;
  date: Date;
  dash?: boolean;
  label: string;
  labelYOffsetLevel: number;
}

export default function ChartVerticalMarker({
  xScale,
  date,
  dash = false,
  label,
  labelYOffsetLevel,
}: Props) {
  const markerLocation = xScale(date);

  return (
    <g>
      <ChartVerticalLabel label={label} labelYOffsetLevel={labelYOffsetLevel} x={markerLocation} />
      <VerticalLine dash={dash} length={GRAPH_HEIGHT} x={markerLocation} y={0} />
    </g>
  );
}
