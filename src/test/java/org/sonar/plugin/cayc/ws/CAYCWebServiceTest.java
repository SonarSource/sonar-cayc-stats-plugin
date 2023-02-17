/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
package org.sonar.plugin.cayc.ws;

import org.junit.Test;
import org.sonar.api.server.ws.WebService.Action;
import org.sonar.api.server.ws.WebService.Context;
import org.sonar.api.server.ws.WebService.Controller;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.spy;

public class CAYCWebServiceTest {
  private CAYCWebService underTest = new CAYCWebService();
  @Test
  public void chartDataActionDefinition() {
    Context context = spy(Context.class);
    underTest.define(context);

    Controller controller = context.controllers().get(0);
    assertEquals("api/cayc", controller.path());
    assertEquals("Clean as You Code metrics", controller.description());

    Action action = controller.action("issues_creation_histogram");
    assertNotNull(action);
    assertEquals("api/cayc/issues_creation_histogram", action.path());
    assertEquals("Data for the Clean as You Code chart", action.description());
    assertTrue(controller.isInternal());

    var yearsParam = action.param("years");
    assertNotNull(yearsParam);
    assertEquals("Number of years to start the histogram from. Defaults to 8 years.", yearsParam.description());
    assertEquals(Integer.valueOf(20), yearsParam.maximumValue());
    assertEquals("8", yearsParam.defaultValue());
    assertEquals("5", yearsParam.exampleValue());
  }

}
