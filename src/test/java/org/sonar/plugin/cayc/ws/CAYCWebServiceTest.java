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
    assertEquals("Clean As You Code metrics", controller.description());

    Action action = controller.action("issues_creation_histogram");
    assertNotNull(action);
    assertEquals("api/cayc/issues_creation_histogram", action.path());
    assertEquals("Data for the Clean As You Code chart", action.description());
    assertTrue(controller.isInternal());
  }

}