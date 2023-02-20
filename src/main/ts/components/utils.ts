/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import { subMonths } from 'date-fns';
import { CAYC_PERIOD_IN_MONTHS } from '../constants';

export function computeCaycStartingDate() {
  return subMonths(new Date(), CAYC_PERIOD_IN_MONTHS);
}
