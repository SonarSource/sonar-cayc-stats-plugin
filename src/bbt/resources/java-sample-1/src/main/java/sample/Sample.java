package sample;

import java.util.regex.Pattern;
public class Sample {
  private static Pattern nonCompliantPattern = Pattern.compile("(a|b)*");
  private static Pattern nonCompliantPattern2 = Pattern.compile("\\c!");
  private static Pattern nonCompliantPattern3 = Pattern.compile("\\c!");

  public Sample(int i) {
		int j = i++;
	}

  // TODO Raise an issue here!
  private String myMethod() {
		return "hello";
	}

  // TODO This method raises 3 new issues (TODO, unused, empty block)
  private void unusedAndEmpty() {

  }
}
