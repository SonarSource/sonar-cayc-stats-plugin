/*
 * Copyright (C) 2022-2023 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
package org.sonar.plugin.cayc.ws;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.RequestHandler;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;
import org.sonarqube.ws.Common.FacetValue;
import org.sonarqube.ws.client.WsClient;
import org.sonarqube.ws.client.WsClientFactories;
import org.sonarqube.ws.client.issues.SearchRequest;

import static org.sonar.api.rules.RuleType.BUG;
import static org.sonar.api.rules.RuleType.VULNERABILITY;

public class CAYCChartDataRequestHandler implements RequestHandler {
  private static final int MAX_YEARS = 15;
  private WsClient wsClient;

  public CAYCChartDataRequestHandler() {
  }

  public CAYCChartDataRequestHandler(WsClient wsClient) {
    this.wsClient = wsClient;
  }

  @Override
  public void handle(Request request, Response response) {
    initialiseWsClient(request);
    writeResponse(response, issuesCreatedHistogram());
  }

  private List<FacetValue> issuesCreatedHistogram() {
    boolean found = false;
    List<FacetValue> result = new ArrayList<>();

    for (int i = MAX_YEARS - 1; i >= 0; i--) {
      var year = getDateMinusYear(i);
      var request = yearlyCreatedIssuesSearchRequest(year);
      var response = wsClient.issues().search(request);
      if (found || response.getTotal() > 0) {
        found = true;
        result.addAll(response.getFacets().getFacets(0).getValuesList());
      }
    }

    Collections.sort(result, Comparator.comparing(FacetValue::getVal));

    return result;
  }

  private static LocalDate getDateMinusYear(int year) {
    LocalDate currentYear = LocalDate.now();
    return currentYear.minusYears(year);
  }

  private SearchRequest yearlyCreatedIssuesSearchRequest(LocalDate date) {
    return new SearchRequest()
      .setCreatedAfter(isoFormat(date.minusYears(1)))
      .setCreatedBefore(isoFormat(date))
      .setTypes(List.of(BUG.name(), VULNERABILITY.name()))
      .setResolved(Boolean.FALSE.toString())
      .setFacets(List.of("createdAt"));
  }

  private String isoFormat(LocalDate date) {
    return date.format(DateTimeFormatter.ISO_DATE);
  }

  private void initialiseWsClient(Request request) {
    if (wsClient == null) {
      wsClient = WsClientFactories.getLocal().newClient(request.localConnector());
    }
  }

  private static void writeResponse(Response response, List<FacetValue> facetValues) {
    try (JsonWriter json = response.newJsonWriter()) {
      json.beginObject()
        .name("history")
        .beginArray();

      facetValues.forEach(
        v -> json.beginObject()
          .prop("date", v.getVal())
          .prop("value", v.getCount())
          .endObject()
      );

      json.endArray()
        .endObject()
        .close();
    }
  }
}
