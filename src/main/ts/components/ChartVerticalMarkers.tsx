/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import styled from '@emotion/styled';
import { ScaleTime } from 'd3-scale';
import React from 'react';
import { computeCaycStartingDate } from './utils';

interface Props {
  xScale: ScaleTime<number, number>;
}

export default function ChartVericalMarkers({ xScale }: Props) {
  const caycStartMarkerLocation = xScale(computeCaycStartingDate());
  const nowMarkerLocation = xScale(new Date());
  return (
    <>
      <VerticalMarker
        dash={true}
        x1={caycStartMarkerLocation}
        x2={caycStartMarkerLocation}
        y1={20}
        y2={300}
      />

      <VerticalMarker dash={false} x1={nowMarkerLocation} x2={nowMarkerLocation} y1={20} y2={300} />
    </>
  );
}
const VerticalMarker = styled.line((props: { dash: boolean }) => ({
  stroke: '#c3c3c3',
  strokeWidth: '2px',
  strokeDasharray: props.dash ? '4,6' : '',
}));
