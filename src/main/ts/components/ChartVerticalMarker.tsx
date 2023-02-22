/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
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
