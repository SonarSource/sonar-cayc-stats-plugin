# sonar-cayc-stats-plugin
SonarQube plugin showcasing the Clean as You Code (CaYC) approach to development

## Compatibility
The plugin is compatible with SonarQube 8.9 and later versions.

## Installation
1. Build the project using Maven by running `mvn package`.
2. Copy the generated `target/sonar-cayc-plugin-VERSION.jar` file to the `extensions/plugins` folder of your SonarQube installation.
3. Restart SonarQube.

## Usage
Once SonarQube is started, you can access the `What is Clean as You Code?` page, by clicking `More` in the top bar. 
The page will show information about the **CaYC** approach, as well as a projection of how the total code issues in the instance would had evolved if **CaYC** was enforced on specific points in time in the past.

## Frontend development
* `yarn` to install your dependencies.
* `yarn start` to start a proxy server on port 3000 to debug your JS code.  
  *Note: This plugin must first be deployed and installed on your SonarQube instance, otherwise the extension paths will not be registered.
* `yarn test` to start watching your files for changes, and run tests accordingly.
* `yarn build` to build your front-end code.
