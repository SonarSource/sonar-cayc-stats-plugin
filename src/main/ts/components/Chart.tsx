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
import styled from '@emotion/styled';
import { format, formatDuration } from 'date-fns';
import { t as translate, tp as translateWithParameters } from 'i18n';
import { debounce } from 'lodash';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { getProjects } from '../api';
import { GRAPH_HEIGHT, GRAPH_VERTICAL_MARKER_DATE_FORMAT, GRAPH_WIDTH } from '../constants';
import ChartLine from './ChartLine';
import ChartVerticalLabel from './ChartVerticalLabel';
import ChartVerticalMarker from './ChartVerticalMarker';
import Spinner from './Spinner';
import useData, { ProjectOption } from './useData';

const CHART_SIDEBAR_WIDTH = 250;
const DEBOUNCE_DELAY = 250;
const ARROW = `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg'
  width='10' height='100'%3e%3cpath d='M5 99 L0 90 L5 90 L5 0 L6 0 L6 90 L10 90 L5 99'
  stroke-width='1' fill='limegreen' stroke='limegreen'/%3e%3c/svg%3e`;

const DEFAULT_PROJECT = {
  value: '',
  label: translate('cayc.chart.title.project.all'),
};

export default function Chart() {
  const {
    isLoading,
    cumulativeData,
    caycProjectionData,
    hasRequestFailed,
    xScale,
    yScale,
    caycAvailableDurations,
    currentCaycDuration,
    setCurrentCaycDuration,
    caycStartingDate,
    chartStartingDate,
    chartEndDate,
    setSelectedProject,
    selectedProject,
  } = useData();

  const handleLoadProjects = (nameFilter: string, resolve: (options: ProjectOption[]) => void) => {
    getProjects(nameFilter)
      .then((components) => {
        if (!components || components.length === 0) {
          resolve([]);
        }
        const options = [
          DEFAULT_PROJECT,
          ...components.map(({ key, name }) => {
            return {
              value: key,
              label: name,
            } as ProjectOption;
          }),
        ];
        resolve(options);
      })
      .catch(() => {
        resolve([]);
      });
  };

  const debouncedLoadProjects = React.useRef(debounce(handleLoadProjects, DEBOUNCE_DELAY));

  const hasData =
    cumulativeData?.length > 0 &&
    caycProjectionData?.length > 0 &&
    chartStartingDate &&
    caycStartingDate;

  if (hasRequestFailed) {
    return <p>{translate('cayc.request_failed')}</p>;
  }

  const issuesDelta = () =>
    yScale.tickFormat(
      undefined,
      '~s',
    )(
      cumulativeData[cumulativeData.length - 1].y -
        caycProjectionData[caycProjectionData.length - 1].y,
    );

  return (
    <div>
      <Row>
        <Title id="cayc.chart.title">
          <FormattedMessage
            id="cayc.chart.title"
            defaultMessage={translate('cayc.chart.title')}
            values={{
              cayc: <strong>&nbsp;{translate('cayc')}&nbsp;</strong>,
            }}
          />
          <LeftPadded>
            <AsyncSelect
              aria-label={translate('cayc.project_select.label')}
              isSearchable
              isClearable
              cacheOptions
              defaultOptions
              value={selectedProject ?? DEFAULT_PROJECT}
              loadOptions={debouncedLoadProjects.current}
              onChange={setSelectedProject}
              styles={{
                control: (base) => ({
                  ...base,
                  minWidth: '15rem',
                  minHeight: '2rem',
                  height: '2rem',
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: '0 0.5rem',
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: '0.25rem',
                }),
                clearIndicator: (base) => ({
                  ...base,
                  padding: '0.25rem',
                }),
                option: (base) => ({
                  ...base,
                  padding: '0.25rem 0.5rem',
                }),
                input: (base) => ({
                  ...base,
                  margin: '0',
                }),
              }}
            />
          </LeftPadded>
          <LeftPadded>
            <Select
              aria-label={translate('cayc.period_select.label')}
              isSearchable={false}
              value={currentCaycDuration}
              onChange={(option) => option && setCurrentCaycDuration(option)}
              options={caycAvailableDurations}
              getOptionLabel={(option) =>
                translateWithParameters(
                  'cayc.chart.title.period_option',
                  formatDuration(option.duration),
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
      </Row>
      <Aligned>
        {hasData && !isLoading && (
          <>
            <Graph height={GRAPH_HEIGHT} width={GRAPH_WIDTH + CHART_SIDEBAR_WIDTH}>
              <ChartVerticalLabel
                label={format(chartStartingDate, GRAPH_VERTICAL_MARKER_DATE_FORMAT)}
                labelYOffsetLevel={3}
                x={0}
              />
              <ChartVerticalMarker
                xScale={xScale}
                date={caycStartingDate}
                dash
                label={format(caycStartingDate, GRAPH_VERTICAL_MARKER_DATE_FORMAT)}
                labelYOffsetLevel={2}
              />
              {cumulativeData.length > 0 && (
                <ChartVerticalMarker
                  xScale={xScale}
                  date={chartEndDate}
                  label={translate('cayc.chart.now')}
                  labelYOffsetLevel={1}
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
                projection
              />
            </Graph>
            <GraphAnnotation>
              <img aria-hidden alt="arrow" src={ARROW} />
              <IssuesDeltaText>
                <Paragraph>{translate('cayc.chart.nudge')}</Paragraph>
                <Paragraph>
                  <FormattedMessage
                    id="cayc.chart.fewer_issues"
                    defaultMessage={translate('cayc.chart.fewer_issues')}
                    values={{
                      count: <strong>{issuesDelta()}</strong>,
                    }}
                  />
                </Paragraph>
              </IssuesDeltaText>
            </GraphAnnotation>
          </>
        )}
        {!hasData && !isLoading && <p>{translate('cayc.no_data')}</p>}
        {isLoading && <Spinner />}
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
  lineHeight: '24px',
  color: 'rgb(29, 33, 47)',
  fontSize: '16px',
  fontWeight: 400,
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

const Paragraph = styled.p({
  margin: '1rem',
});

const Graph = styled.svg({
  border: '1px solid #ccc',
  borderRight: 'none',
  overflow: 'visible',
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
