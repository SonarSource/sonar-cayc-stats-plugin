/*
 * Copyright (C) SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import { screen } from "@testing-library/react";
import React from "react";
import { renderComponent } from "../../testHelpers";
import CleanAsYouCode from "../CleanAsYouCode";

jest.mock("../../api", () => {
  const { subMonths } = jest.requireActual("date-fns");
  const history = [];
  for (let i = 0; i < 36; i++) {
    history.push({
      x: subMonths(new Date(), i),
      y: Math.floor(Math.random() * 20),
    });
  }
  return {
    getIssues: jest.fn().mockResolvedValue(history),
  };
});

it("should render correctly", async () => {
  renderComponent(<CleanAsYouCode />);

  expect(await screen.findByText("cayc.title")).toBeInTheDocument();
  expect(screen.getByText("cayc.description")).toBeInTheDocument();
});
