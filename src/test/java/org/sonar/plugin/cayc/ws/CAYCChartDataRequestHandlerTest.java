package org.sonar.plugin.cayc.ws;

import org.junit.Before;
import org.junit.Test;
import org.sonar.api.server.ws.Response;
import org.sonarqube.ws.Issues;
import org.sonarqube.ws.Issues.SearchWsResponse;
import org.sonarqube.ws.client.WsClient;
import org.sonarqube.ws.client.issues.IssuesService;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

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
  public void noHistoryBeforeSQ() {
    var request = new MockChartDataRequest();

    var issueServices = mock(IssuesService.class);
    doReturn(issueServices).when(wsClientMock).issues();
    SearchWsResponse searchWsResponse = SearchWsResponse.newBuilder().addIssues(Issues.Issue.newBuilder().setStatus("open")).build();
    doReturn(searchWsResponse).when(issueServices).search(any());
    underTest.handle(request, response);

    assertEquals("\"issues {\\n  status: \\\"open\\\"\\n}\\n\"", ((DumbResponse) response).output.toString());
  }
}