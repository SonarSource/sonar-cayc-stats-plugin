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
