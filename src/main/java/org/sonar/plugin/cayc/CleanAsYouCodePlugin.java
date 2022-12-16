/*
 * Copyright (C) 2022-2022 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
package org.sonar.plugin.cayc;

import org.sonar.api.Plugin;
import org.sonar.plugin.cayc.web.CAYCPageDefinition;
import org.sonar.plugin.cayc.ws.CAYCChartDataRequestHandler;
import org.sonar.plugin.cayc.ws.CAYCWebService;

/**
 * This class is the entry point for all extensions. It is referenced in pom.xml.
 */
public class CleanAsYouCodePlugin implements Plugin {

  @Override
  public void define(Context context) {
    context.addExtension(CAYCWebService.class);
    context.addExtension(CAYCChartDataRequestHandler.class);
    context.addExtension(CAYCPageDefinition.class);
  }
}
