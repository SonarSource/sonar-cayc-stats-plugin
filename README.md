# sonar-cayc-stats-plugin

Demonstrates the value of Clean as You Code methodology. 

Download the JAR file [here](https://binaries.sonarsource.com/?prefix=Distribution/sonar-cayc-plugin/).

## Compatibility

The plugin is compatible with SonarQube 8.9 and later versions.

## Building

To build the plugin JAR file, call:

```
mvn clean package
```

The JAR will be deployed to `target/sonar-cayc-plugin-VERSION.jar`. Copy this to your SonarQube's `extensions/plugins/` directory, and re-start SonarQube.

## Frontend development

* `yarn` to install your dependencies.
* `yarn start` to start a proxy server on port 3000 to debug your JS code.  
  *Note: This plugin must first be deployed and installed on your SonarQube instance, otherwise the extension paths will not be registered.
* `yarn test` to start watching your files for changes, and run tests accordingly.
* `yarn build` to build your front-end code.
