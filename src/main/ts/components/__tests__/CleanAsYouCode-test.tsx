/*
 * Copyright (C) SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import { screen } from "@testing-library/react";
import React from "react";
import { renderComponent } from "../../testHelpers";
import CleanAsYouCode from "../CleanAsYouCode";

it("should render correctly", () => {
  renderComponent(<CleanAsYouCode />);

  expect(screen.getByText("cayc.title")).toBeInTheDocument();
  expect(screen.getByText("cayc.description")).toBeInTheDocument();
});
