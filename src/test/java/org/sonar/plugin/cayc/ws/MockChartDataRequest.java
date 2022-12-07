package org.sonar.plugin.cayc.ws;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.sonar.api.server.ws.impl.ValidatingRequest;

public class MockChartDataRequest extends ValidatingRequest {

  @Override
  protected String readParam(String s) {
    return null;
  }

  @Override
  protected List<String> readMultiParam(String s) {
    return null;
  }

  @Override
  protected InputStream readInputStreamParam(String s) {
    return null;
  }

  @Override
  protected Part readPart(String s) {
    return null;
  }

  @Override
  public String method() {
    return null;
  }

  @Override
  public String getMediaType() {
    return null;
  }

  @Override
  public boolean hasParam(String s) {
    return false;
  }

  @Override
  public Map<String, String[]> getParams() {
    return null;
  }

  @Override
  public Optional<String> header(String s) {
    return Optional.empty();
  }

  @Override
  public String getPath() {
    return null;
  }
}
