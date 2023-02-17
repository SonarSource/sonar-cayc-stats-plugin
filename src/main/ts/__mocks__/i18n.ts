/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
export function t(...keys: string[]) {
  return keys.join('.');
}

export function tp(messageKey: string, ...parameters: Array<string | number>) {
  return [messageKey, ...parameters].join('.');
}
