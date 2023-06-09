/*
 * Clean as You Code Plugin
 * Copyright (C) 2022-2023 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
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
  }

}
