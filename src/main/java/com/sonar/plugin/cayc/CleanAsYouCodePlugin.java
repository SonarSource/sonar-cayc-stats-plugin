/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
package com.sonar.plugin.cayc;

import com.sonar.plugin.cayc.ws.CAYCChartDataRequestHandler;
import com.sonar.plugin.cayc.ws.CAYCWebService;
import org.sonar.api.Plugin;
import com.sonar.plugin.cayc.web.CAYCPageDefinition;

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
