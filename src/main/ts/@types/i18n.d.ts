/*
 * Copyright (C) 2022-2022 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
declare module 'i18n' {
  // translate
  export function t(...keys: string[]): string;

  // translateWithParameters
  export function tp(messageKey: string, ...parameters: Array<string | number>): string;
}
