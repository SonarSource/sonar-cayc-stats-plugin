package org.sonar.plugin.cayc.ws;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.RequestHandler;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;
import org.sonar.plugin.cayc.ws.exceptions.InvalidRequestException;
import org.sonarqube.ws.Common.FacetValue;
import org.sonarqube.ws.client.WsClient;
import org.sonarqube.ws.client.WsClientFactories;
import org.sonarqube.ws.client.issues.SearchRequest;

import static org.sonar.plugin.cayc.ws.CAYCWebService.DEFAULT_YEARS;

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

    try {
      writeResponse(response, issuesCreatedHistogram(getYears(request)));
    } catch (InvalidRequestException e) {
      try (JsonWriter json = response.newJsonWriter()) {
        json.beginObject()
          .prop("msg", e.getMessage())
          .endObject()
          .close();
      }
    }
  }

  private List<FacetValue> issuesCreatedHistogram(int years) {
    List<LocalDate> yearDates = new ArrayList<>();
    for (int year = years - 1; year >= 0; year--) {
      yearDates.add(getDateMinusYear(year));
    }

    return yearDates.stream()
      .map(this::yearlyCreatedIssuesSearchRequest)
      .map(request -> wsClient.issues().search(request))
      .flatMap(response -> response.getFacets().getFacets(0).getValuesList().stream())
      .collect(Collectors.toList());
  }

  private static LocalDate getDateMinusYear(int year) {
    LocalDate currentYear = LocalDate.now();
    return currentYear.minusYears(year);
  }

  private static int getYears(Request request) throws InvalidRequestException {
    String years = request.param("years");
    if (years != null) {
      try {
        int yearsNumber = Integer.parseInt(years);
        if (yearsNumber <= 0) {
          throw new InvalidRequestException("Invalid \"years\" parameter: " + years + ". Should be a positive number");
        }
        return yearsNumber;
      } catch (NumberFormatException e) {
        throw new InvalidRequestException("Invalid \"years\" parameter: " + years, e);
      }
    }
    return DEFAULT_YEARS;
  }

  private SearchRequest yearlyCreatedIssuesSearchRequest(LocalDate date) {
    return new SearchRequest()
      .setCreatedAfter(isoFormat(date.minusYears(1)))
      .setCreatedBefore(isoFormat(date))
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
