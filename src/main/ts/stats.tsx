/*
 * Copyright (C) 2022-2022 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
import React from "react";
import CleanAsYouCode from "./components/CleanAsYouCode";

(window as any).registerExtension("cayc/stats", () => {
  return <CleanAsYouCode />;
});
