/*
 * Clean as You Code Plugin
 * Copyright (C) 2022-2024 SonarSource SA
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
package org.sonar.plugin.cayc.bbt;

import com.codeborne.selenide.Condition;
import com.codeborne.selenide.Configuration;
import com.sonar.orchestrator.build.MavenBuild;
import com.sonar.orchestrator.junit4.OrchestratorRule;
import com.sonar.orchestrator.locator.FileLocation;
import com.sonar.orchestrator.locator.MavenLocation;
import java.io.File;
import java.net.URISyntaxException;
import java.nio.file.Paths;
import java.util.List;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.sonarqube.ws.client.HttpConnector;
import org.sonarqube.ws.client.WsClient;
import org.sonarqube.ws.client.WsClientFactories;
import org.sonarqube.ws.client.issues.SearchRequest;

import static com.codeborne.selenide.Selectors.byXpath;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.open;
import static org.assertj.core.api.Assertions.assertThat;

public class CAYCChartDataBBT {
  public static final FileLocation CAYC_PLUGIN_LOCATION = FileLocation.byWildcardMavenFilename(new File("./target"), "sonar-cayc-plugin-*.jar");

  @ClassRule
  public static OrchestratorRule ORCHESTRATOR = OrchestratorRule.builderEnv()
    .setSonarVersion(System.getProperty("sonar.runtimeVersion", "LATEST_RELEASE"))
    .addPlugin(CAYC_PLUGIN_LOCATION)
    .useDefaultAdminCredentialsForBuilds(true)
    .addBundledPluginToKeep("sonar-java")
    .build();

  @BeforeClass
  public static void setUp() {
    String browserKey = ORCHESTRATOR.getConfiguration().getString("orchestrator.browser", "chrome");
    Configuration.browser = browserKey;
    Configuration.baseUrl = ORCHESTRATOR.getServer().getUrl();
    Configuration.timeout = 10_000;
    Configuration.reportsFolder = "build/screenshots";
    Configuration.screenshots = true;
    Configuration.headless = Boolean.parseBoolean(ORCHESTRATOR.getConfiguration().getString("orchestrator.browser.headless", "false"));
    Configuration.savePageSource = true;
    Configuration.browserSize = "1280x1024";
    Configuration.downloadsFolder = Paths.get(System.getProperty("java.io.tmpdir"), "selenide_download").toString();
  }

  @Test
  public void open_plugin_page() throws URISyntaxException {

    WsClient wsClient = WsClientFactories.getDefault().newClient(
      HttpConnector.newBuilder()
        .url(ORCHESTRATOR.getServer().getUrl())
        .build());

    ORCHESTRATOR.executeBuild(
      MavenBuild.create()
        .setPom(new File(getClass().getResource("/java-sample/pom.xml").toURI()))
        .setCleanPackageSonarGoals());

    ORCHESTRATOR.executeBuild(
      MavenBuild.create()
        .setPom(new File(getClass().getResource("/java-sample-1/pom.xml").toURI()))
        .setCleanPackageSonarGoals());

    long issuesNumber = wsClient
      .issues()
      .search(new SearchRequest().setTypes(List.of("BUG", "VULNERABILITY")))
      .getIssuesCount();

    assertThat(issuesNumber).isPositive();

    open("/");
    $(byXpath("//button[contains(text(), 'More') or descendant::*[contains(text(), 'More')]] | //a[contains(text(), 'More') or descendant::*[contains(text(), 'More')]]")).click();
    $(byXpath("//a[contains(text(), 'Clean as You Code') or descendant::*[contains(text(), 'Clean as You Code')]]")).click();
    $("[data-testid='current-issue-count']").shouldHave(Condition.text(issuesNumber + " issues"));

    $("[aria-label='Project']").click();
    $("#react-select-2-option-1").click();

    long javaSampleIssuesNumber = wsClient
      .issues()
      .search(new SearchRequest().setTypes(List.of("BUG", "VULNERABILITY")).setComponentKeys(List.of("org.sonarsource.plugins.cayc:java-sample")))
      .getIssuesCount();

    $("[data-testid='current-issue-count']").shouldHave(Condition.text(javaSampleIssuesNumber + " issues"));

    $("[aria-label='Project']").click();
    $("#react-select-2-option-2").click();

    long javaSample1IssuesNumber = wsClient
      .issues()
      .search(new SearchRequest().setTypes(List.of("BUG", "VULNERABILITY")).setComponentKeys(List.of("org.sonarsource.plugins.cayc:java-sample-1")))
      .getIssuesCount();

    $("[data-testid='current-issue-count']").shouldHave(Condition.text(javaSample1IssuesNumber + " issues"));
  }

}
