/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import { Dict } from '../types/generic';

type RequestData = Dict<any>;

declare module 'sonar-request' {
  export function getJSON(url: string, data?: RequestData, bypassRedirect?: boolean): Promise<any>;
}
