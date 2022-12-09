package org.sonar.plugin.cayc.ws.exceptions;

public class InvalidRequestException extends Exception {

  public InvalidRequestException(String message) {
    super(message);
  }

  public InvalidRequestException(String message, Throwable cause) {
    super(message, cause);
  }
}
