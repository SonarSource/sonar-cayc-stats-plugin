/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { t as translate } from 'i18n';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  CAYC_PERIOD_IN_MONTHS,
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
  const { loading, data, projection, xScale, yScale, originDate, caycStartingDate, nowDate } =
    useData();

  if (loading) {
    return <Spinner />;
  }

  const formatYScale = yScale.tickFormat(undefined, '~s');
  const issuesDelta = formatYScale(data[data.length - 1].y - projection[projection.length - 1].y);

  return (
    <div>
      <div>
        <Title>
          <FormattedMessage
            id="cayc.chart.title"
            defaultMessage={translate('cayc.chart.title')}
            values={{
              cayc: <strong>{translate('cayc')}</strong>,
              count: CAYC_PERIOD_IN_MONTHS / 12, // CaYC period is in months
            }}
          />
        </Title>
      </div>
      <Aligned>
        <Graph height={GRAPH_HEIGHT} width={GRAPH_WIDTH + CHART_SIDEBAR_WIDTH}>
          <text textAnchor="left" x={0} dy={GRAPH_VERTICAL_MARKER_Y_POSITION_OFFSET}>
            {format(originDate, GRAPH_VERTICAL_MARKER_DATE_FORMAT)}
          </text>
          <ChartVerticalMarker
            xScale={xScale}
            date={caycStartingDate}
            dash={true}
            label={format(caycStartingDate, GRAPH_VERTICAL_MARKER_DATE_FORMAT)}
          />
          <ChartVerticalMarker xScale={xScale} date={nowDate} label={translate('cayc.chart.now')} />
          <ChartLine data={projection} xScale={xScale} yScale={yScale} projection={true} />
          <ChartLine data={data} xScale={xScale} yScale={yScale} />
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
                  count: <IssuesDeltaCount>{issuesDelta}</IssuesDeltaCount>,
                  fewer: <strong>{translate('fewer')}</strong>,
                }}
              />
            </Paragraph>
          </IssuesDeltaText>
        </GraphAnnotation>
      </Aligned>
    </div>
  );
}

const Title = styled.h1({
  fontSize: '1.5rem',
  marginTop: '0.5rem',
  marginBottom: '5rem',
});

const Aligned = styled.div({
  display: 'flex',
  alignItems: 'stretch',
});

const Paragraph = styled.p({
  fontSize: '1.1rem',
  margin: '1rem',
});

const IssuesDeltaCount = styled.span({
  color: '#236a97',
  fontWeight: 'bold',
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
