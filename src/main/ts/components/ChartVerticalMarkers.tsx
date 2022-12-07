/*
 * Copyright (C) SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */

import styled from "@emotion/styled";
import { ScaleTime } from "d3-scale";
import { subYears } from "date-fns";
import React from "react";
import { CAYC_PERIOD } from "../constants";

interface Props {
  xScale: ScaleTime<number, number>;
}

export default function ChartVericalMarkers({ xScale }: Props) {
  const CaycStartMarkerLocation = xScale(subYears(new Date(), CAYC_PERIOD));
  const NowMarkerLocation = xScale(new Date());
  return (
    <>
      <VerticalMarker
        dash={true}
        x1={CaycStartMarkerLocation}
        x2={CaycStartMarkerLocation}
        y1={20}
        y2={300}
      />
      <g>
        <VerticalMarker
          dash={false}
          x1={NowMarkerLocation}
          x2={NowMarkerLocation}
          y1={20}
          y2={300}
        />
      </g>
    </>
  );
}
const VerticalMarker = styled.line((props: { dash: boolean }) => ({
  stroke: "#c3c3c3",
  strokeWidth: "2px",
  strokeDasharray: props.dash ? "4,6" : "",
}));
