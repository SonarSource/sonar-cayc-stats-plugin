package org.sonar.plugin.cayc.ws;

import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;
import org.sonarqube.ws.Common.Facet;
import org.sonarqube.ws.Common.FacetValue;
import org.sonarqube.ws.Common.Facets;
import org.sonarqube.ws.Issues.SearchWsResponse;
import org.sonarqube.ws.client.WsClient;
import org.sonarqube.ws.client.issues.IssuesService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.sonar.test.JsonAssert.assertJson;

public class CAYCChartDataRequestHandlerTest {

  private CAYCChartDataRequestHandler underTest;
  private WsClient wsClientMock = mock(WsClient.class);
  private Response response;

  @Before
  public void setup() {
    underTest = new CAYCChartDataRequestHandler(wsClientMock);
    response = new DumbResponse();
  }

  @Test
  public void defaultYearParameter() {
    var request = mock(Request.class);

    mockIssuesSearch();
    underTest.handle(request, response);

    assertJson(((DumbResponse) response).output.toString())

      .isSimilarTo(this.getClass().getResource("issues_histogram_8_years.json"));
  }

  @Test
  public void yearParameter() {
    var request = mock(Request.class);
    doReturn("1").when(request).param("years");

    mockIssuesSearch();
    underTest.handle(request, response);

    assertJson(((DumbResponse) response).output.toString())
      .isSimilarTo(this.getClass().getResource("issues_histogram_1_year.json"));
  }

  @Test
  public void givenAnInvalidYearsParamWhenHandlingRequestThenAnErrorMessageShouldBeReturned() {
    var request = mock(Request.class);
    doReturn("test").when(request).param("years");
    mockIssuesSearch();
    underTest.handle(request, response);

    assertJson(((DumbResponse) response).output.toString())
      .isSimilarTo("{\"msg\":\"Invalid \\\"years\\\" parameter: test\"}");
  }

  private void mockIssuesSearch() {
    var issueServices = mock(IssuesService.class);
    doReturn(issueServices).when(wsClientMock).issues();

    Facet facet = mock(Facet.class);
    List<FacetValue> facetValues = mockYearlyFacetValues("2022");
    doReturn(facetValues).when(facet).getValuesList();

    Facets facets = mock(Facets.class);
    doReturn(facet).when(facets).getFacets(anyInt());

    SearchWsResponse searchWsResponse = mock(SearchWsResponse.class);
    doReturn(facets).when(searchWsResponse).getFacets();

    doReturn(searchWsResponse).when(issueServices).search(any());
  }

  private List<FacetValue> mockYearlyFacetValues(String year) {
    return List.of(
      mockFacetValue(year + "-01-01", 52),
      mockFacetValue(year + "-02-01", 100),
      mockFacetValue(year + "-03-01", 200),
      mockFacetValue(year + "-04-01", 250),
      mockFacetValue(year + "-05-01", 260),
      mockFacetValue(year + "-06-01", 200),
      mockFacetValue(year + "-07-01", 450),
      mockFacetValue(year + "-08-01", 460),
      mockFacetValue(year + "-09-01", 500),
      mockFacetValue(year + "-10-01", 520),
      mockFacetValue(year + "-11-01", 500),
      mockFacetValue(year + "-12-01", 560)
    );
  }

  private FacetValue mockFacetValue(String date, long issues) {
    FacetValue facetValue = mock(FacetValue.class);
    doReturn(date).when(facetValue).getVal();
    doReturn(issues).when(facetValue).getCount();
    return facetValue;
  }
}