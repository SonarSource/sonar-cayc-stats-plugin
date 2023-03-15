/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import styled from '@emotion/styled';
import { format, formatDuration } from 'date-fns';
import { t as translate, tp as translateWithParameters } from 'i18n';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import {
  GRAPH_HEIGHT,
  GRAPH_VERTICAL_MARKER_DATE_FORMAT,
  GRAPH_VERTICAL_MARKER_Y_POSITION_OFFSET,
  GRAPH_WIDTH,
} from '../constants';
import ChartLine from './ChartLine';
import ChartVerticalMarker from './ChartVerticalMarker';
import Spinner from './Spinner';
import useData from './useData';

const CHART_SIDEBAR_WIDTH = 250;
const ARROW = `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' 
  width='10' height='100'%3e%3cpath d='M5 99 L0 90 L5 90 L5 0 L6 0 L6 90 L10 90 L5 99' 
  stroke-width='1' fill='limegreen' stroke='limegreen'/%3e%3c/svg%3e`;

export default function Chart() {
  const {
    loading,
    cumulativeData,
    caycProjectionData,
    xScale,
    yScale,
    caycAvailableDurations,
    currentCaycDuration,
    setCurrentCaycDuration,
    caycStartingDate,
    chartStartingDate,
    chartEndDate,
  } = useData();

  if (loading) {
    return <Spinner />;
  }

  if (cumulativeData?.length === 0 || caycProjectionData?.length === 0) {
    return translate('cayc.no_data');
  }

  const formatYScale = yScale.tickFormat(undefined, '~s');
  const issuesDelta = formatYScale(
    cumulativeData[cumulativeData.length - 1].y -
      caycProjectionData[caycProjectionData.length - 1].y
  );

  return (
    <div>
      <div>
        <Title>
          <FormattedMessage
            id="cayc.chart.title"
            defaultMessage={translate('cayc.chart.title')}
            values={{
              cayc: (
                <LeftPadded>
                  <strong>{translate('cayc')}</strong>
                </LeftPadded>
              ),
            }}
          />
          <LeftPadded>
            <Select
              isSearchable={false}
              value={currentCaycDuration}
              onChange={(option) => option && setCurrentCaycDuration(option)}
              options={caycAvailableDurations}
              getOptionLabel={(option) =>
                translateWithParameters(
                  'cayc.chart.title.period_option',
                  formatDuration(option.duration)
                )
              }
            />
          </LeftPadded>
        </Title>
      </div>
      <Aligned>
        <Graph height={GRAPH_HEIGHT} width={GRAPH_WIDTH + CHART_SIDEBAR_WIDTH}>
          <text textAnchor="left" x={0} dy={-GRAPH_VERTICAL_MARKER_Y_POSITION_OFFSET}>
            {format(chartStartingDate, GRAPH_VERTICAL_MARKER_DATE_FORMAT)}
          </text>
          <ChartVerticalMarker
            xScale={xScale}
            date={caycStartingDate}
            dash={true}
            label={format(caycStartingDate, GRAPH_VERTICAL_MARKER_DATE_FORMAT)}
            displayLabelBelow={true}
          />
          {cumulativeData.length > 0 && (
            <ChartVerticalMarker
              xScale={xScale}
              date={chartEndDate}
              label={translate('cayc.chart.now')}
            />
          )}
          <ChartLine
            data={cumulativeData}
            xScale={xScale}
            yScale={yScale}
            chartEndDate={chartEndDate}
          />
          <ChartLine
            data={caycProjectionData}
            xScale={xScale}
            yScale={yScale}
            chartEndDate={chartEndDate}
            projection={true}
          />
        </Graph>
        <GraphAnnotation>
          <img aria-hidden={true} alt="arrow" src={ARROW} />
          <IssuesDeltaText>
            <Paragraph>{translate('cayc.chart.nudge')}</Paragraph>
            <Paragraph>
              <FormattedMessage
                id="cayc.chart.fewer_issues"
                defaultMessage={translate('cayc.chart.fewer_issues')}
                values={{
                  count: <strong>{issuesDelta}</strong>,
                }}
              />
            </Paragraph>
          </IssuesDeltaText>
        </GraphAnnotation>
      </Aligned>
    </div>
  );
}

const LeftPadded = styled.span({
  marginLeft: '8px',
});

const Title = styled.h1({
  fontSize: '1.5rem',
  marginTop: '0.5rem',
  marginBottom: '5rem',
  display: 'flex',
  alignItems: 'center',
  lineHeight: '2rem',
});

const Aligned = styled.div({
  display: 'flex',
  alignItems: 'stretch',
});

const Paragraph = styled.p({
  fontSize: '1.1rem',
  margin: '1rem',
});

const Graph = styled.svg({
  border: '1px solid #ccc',
  borderRight: 'none',
});

const GraphAnnotation = styled.div({
  border: '1px solid #ccc',
  borderLeft: 'none',
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const IssuesDeltaText = styled.div({
  display: 'flex',
  flexDirection: 'column',
});
