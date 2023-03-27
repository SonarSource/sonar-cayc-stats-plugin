/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
package com.sonar.plugin.cayc.web;

import org.junit.Test;
import org.sonar.api.web.page.Context;
import org.sonar.api.web.page.Page;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class CAYCPageDefinitionTest {

  private final CAYCPageDefinition underTest = new CAYCPageDefinition();

  @Test
  public void testDefineIsCalled() {
    Context context = mock(Context.class);

    underTest.define(context);

    verify(context).addPage(any(Page.class));
  }
}
