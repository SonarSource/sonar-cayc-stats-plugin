/*
 * Copyright (C) 2017-2022 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
/* eslint-disable no-console */
process.env.NODE_ENV = "development";

const fs = require("fs");
const esbuild = require("esbuild");
const http = require("http");
const httpProxy = require("http-proxy");
const getConfig = require("../conf/esbuild-config");

const STATUS_OK = 200;

const port = process.env.PORT || 3000;
const protocol = process.env.HTTPS === "true" ? "https" : "http";
const host = process.env.HOST || "localhost";
const proxyTarget = process.env.PROXY || "http://localhost:9000";

const config = getConfig(false);

function run() {
  console.log("starting...");
  esbuild
    .serve(
      {
        servedir: "target/classes/static",
      },
      config
    )
    .then((result) => {
      const { port: esbuildport } = result;

      const proxy = httpProxy.createProxyServer();
      const esbuildProxy = httpProxy.createProxyServer({
        target: `http://localhost:${esbuildport}`,
      });

      proxy.on("error", (error) => {
        console.error("Backend");
        console.error("\t", error.message);
        console.error("\t", error.stack);
      });

      esbuildProxy.on("error", (error) => {
        console.error("Frontend");
        console.error("\t", error.message);
        console.error("\t", error.stack);
      });

      http
        .createServer((req, res) => {
          if (req.url.match(/static\/cayc/)) {
            // We need to remove the plugin "sub-directory". This is not part of the build output,
            // but is dynamically added by SonarQube. We build: `xxx.js`, but
            // SonarQube serves this under `/static/cayc/xxx.js`.
            req.url = req.url.replace("static/cayc/", "");
            esbuildProxy.web(req, res);
          } else {
            proxy.web(
              req,
              res,
              {
                target: proxyTarget,
              },
              (e) => console.error("req error", e)
            );
          }
        })
        .listen(port);

      console.log(`server started: http://localhost:${port}`);
    })
    .catch((e) => console.error(e));
}

run();
