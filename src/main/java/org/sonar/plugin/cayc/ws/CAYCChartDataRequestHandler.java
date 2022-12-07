package org.sonar.plugin.cayc.ws;

import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.RequestHandler;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;
import org.sonarqube.ws.Issues;
import org.sonarqube.ws.client.WsClient;
import org.sonarqube.ws.client.WsClientFactories;
import org.sonarqube.ws.client.issues.SearchRequest;

public class CAYCChartDataRequestHandler implements RequestHandler {

  private WsClient wsClient;

  public CAYCChartDataRequestHandler() {
  }

  public CAYCChartDataRequestHandler(WsClient wsClient) {
    this.wsClient = wsClient;
  }

  @Override
  public void handle(Request request, Response response) {
    initialiseWsClient(request);
    Issues.SearchWsResponse issuesResponse = wsClient.issues().search(new SearchRequest());
    try (JsonWriter json = response.newJsonWriter()) {
      json
        .value(issuesResponse.toString())
        .close();
    }
  }

  private void initialiseWsClient(Request request) {
    if (wsClient == null) {
      wsClient = WsClientFactories.getLocal().newClient(request.localConnector());
    }
  }
}
