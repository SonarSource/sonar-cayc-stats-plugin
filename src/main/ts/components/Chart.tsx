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
    return <p>{translate('cayc.no_data')}</p>;
  }

  const formatYScale = yScale.tickFormat(undefined, '~s');
  const issuesDelta = formatYScale(
    cumulativeData[cumulativeData.length - 1].y -
      caycProjectionData[caycProjectionData.length - 1].y
  );

  return (
    <div>
      <Row>
        <Title id="cayc.chart.title">
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
              aria-labelledby="cayc.chart.title"
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
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '2rem',
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: '0.25rem',
                }),
                option: (base) => ({
                  ...base,
                  padding: '0.25rem 0.5rem',
                }),
              }}
            />
          </LeftPadded>
        </Title>
        <Information>{translate('cayc.chart.data.disclaimer')}</Information>
      </Row>
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
  display: 'flex',
  alignItems: 'center',
});

const Aligned = styled.div({
  display: 'flex',
  alignItems: 'stretch',
});

const Row = styled.div({
  marginBottom: '5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  justifyContent: 'space-between',
});

const Information = styled.div({
  border: '1px solid rgb(177, 223, 243)',
  borderRadius: '0.125rem',
  padding: '0.5rem',
  backgroundColor: 'rgb(217, 237, 247)',
  color: 'rgb(14, 81, 111)',
});

const Paragraph = styled.p({
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
