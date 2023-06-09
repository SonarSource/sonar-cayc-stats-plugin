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

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;
import org.sonarqube.ws.Common.Facet;
import org.sonarqube.ws.Common.FacetValue;
import org.sonarqube.ws.Common.Facets;
import org.sonarqube.ws.Issues.SearchWsResponse;
import org.sonarqube.ws.client.WsClient;
import org.sonarqube.ws.client.issues.IssuesService;
import org.sonarqube.ws.client.issues.SearchRequest;

import static java.time.format.DateTimeFormatter.ISO_DATE;
import static java.util.stream.Collectors.toSet;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.sonar.api.rules.RuleType.BUG;
import static org.sonar.api.rules.RuleType.VULNERABILITY;
import static org.sonar.test.JsonAssert.assertJson;

public class CAYCChartDataRequestHandlerTest {

  private CAYCChartDataRequestHandler underTest;
  private WsClient wsClientMock = mock(WsClient.class);
  private IssuesService issueService = mock(IssuesService.class);
  private Response response;

  @Before
  public void setup() {
    underTest = new CAYCChartDataRequestHandler(wsClientMock);
    response = new DumbResponse();
    doReturn(issueService).when(wsClientMock).issues();
  }

  @Test
  public void request_last_15_years_issue_history() {
    var request = mock(Request.class);
    mockIssuesSearch();
    ArgumentCaptor<SearchRequest> searchCaptor = ArgumentCaptor.forClass(SearchRequest.class);

    underTest.handle(request, response);

    verify(issueService, times(15)).search(searchCaptor.capture());

    var searchRequests = searchCaptor.getAllValues();

    Set<String> searchYears = IntStream.range(0, 15).boxed().map(i -> LocalDate.now().minusYears(i).format(ISO_DATE)).collect(toSet());

    for (var searchRequest : searchRequests) {
      assertThat(searchYears.remove(searchRequest.getCreatedBefore())).isTrue();
      assertThat(searchRequest.getTypes()).containsExactly(BUG.name(), VULNERABILITY.name());
      assertThat(searchRequest.getResolved()).isEqualTo("false");
      assertThat(searchRequest.getFacets()).containsExactly("createdAt");
    }

    assertThat(searchYears).isEmpty();

  }

  @Test
  public void verify_json_output() {
    var request = mock(Request.class);

    mockIssuesSearch();
    underTest.handle(request, response);

    assertJson(((DumbResponse) response).output.toString())
      .isSimilarTo(this.getClass().getResource("issues_histogram.json"));
  }

  private void mockIssuesSearch() {

    Facet facet = mock(Facet.class);
    var searchResults = IntStream.range(0, 15)
      .map(i -> 2022 - i)
      .boxed()
      .map(this::mockYearlyFacetValues)
      .collect(Collectors.toList());

    var stubbing = when(facet.getValuesList());
    for (var result : searchResults) {
      stubbing = stubbing.thenReturn(result);
    }

    Facets facets = mock(Facets.class);
    doReturn(facet).when(facets).getFacets(anyInt());

    SearchWsResponse searchWsResponse = mock(SearchWsResponse.class);
    doReturn(12L).when(searchWsResponse).getTotal();
    doReturn(facets).when(searchWsResponse).getFacets();

    doReturn(searchWsResponse).when(issueService).search(any());
  }

  private List<FacetValue> mockYearlyFacetValues(int year) {
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
