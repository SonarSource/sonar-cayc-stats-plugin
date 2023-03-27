/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
package com.sonar.plugin.cayc.ws;

import org.sonar.api.server.ws.WebService;

public class CAYCWebService implements WebService {

  @Override
  public void define(Context context) {
    chartDataAction(context);
  }

  private void chartDataAction(Context context) {
    NewController controller = context.createController("api/cayc");
    controller.setDescription("Clean as You Code metrics");
    controller.createAction("issues_creation_histogram")
      .setDescription("Data for the Clean as You Code chart")
      .setHandler(new CAYCChartDataRequestHandler())
      .setInternal(true);
    controller.done();
  }
}
