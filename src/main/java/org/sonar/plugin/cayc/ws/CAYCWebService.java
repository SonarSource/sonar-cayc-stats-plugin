/*
 * Copyright (C) 2022-2022 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
package org.sonar.plugin.cayc.ws;

import org.sonar.api.server.ws.WebService;

public class CAYCWebService implements WebService {

  public static final int DEFAULT_YEARS = 8;

  @Override
  public void define(Context context) {
    chartDataAction(context);
  }

  private void chartDataAction(Context context) {
    NewController controller = context.createController("api/cayc");
    controller.setDescription("Clean As You Code metrics");
    controller.createAction("issues_creation_histogram")
      .setDescription("Data for the Clean As You Code chart")
      .setHandler(new CAYCChartDataRequestHandler())
      .setInternal(true)
      .createParam("years")
      .setDescription("Number of years to start the histogram from. Defaults to 8 years.")
      .setMaximumValue(20)
      .setDefaultValue("8")
      .setExampleValue("5")
      .setRequired(false);
    controller.done();
  }
}
