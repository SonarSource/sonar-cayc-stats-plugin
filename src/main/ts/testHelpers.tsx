/*
 * Copyright (C) 2022-2022 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import { render } from "@testing-library/react";
import React from "react";
import { IntlProvider } from "react-intl";

export function renderComponent(component: React.ReactElement) {
  render(
    <IntlProvider defaultLocale="en" locale="en">
      {component}
    </IntlProvider>
  );
}
