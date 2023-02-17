/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import { parseISO } from 'date-fns';
import { getJSON } from 'sonar-request';

const ROOT = '/api/cayc';

interface Response {
  history: Array<{ date: string; value: number }>;
}

export function getIssues() {
  return getJSON(`${ROOT}/issues_creation_histogram`).then(({ history }: Response) =>
    history.map(({ date, value }) => ({
      x: parseISO(date),
      y: value,
    }))
  );
}
