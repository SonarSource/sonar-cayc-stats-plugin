package org.sonar.plugin.cayc.ws;

import org.sonar.api.server.ws.WebService;

public class CAYCWebService implements WebService {

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
      .setInternal(true);
    controller.done();
  }
}
