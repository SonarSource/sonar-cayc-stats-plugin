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
/* eslint-disable no-console */
process.env.NODE_ENV = 'development';

const fs = require('fs');
const esbuild = require('esbuild');
const http = require('http');
const httpProxy = require('http-proxy');
const getConfig = require('../conf/esbuild-config');

const STATUS_OK = 200;

const port = process.env.PORT || 3000;
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || 'localhost';
const proxyTarget = process.env.PROXY || 'http://localhost:9000';

const config = getConfig(false);

async function run() {
  console.log('starting...');
  const esbuildContext = await esbuild.context(config);
  esbuildContext
    .serve({ servedir: 'target/classes/static' })
    .then((result) => {
      const { port: esbuildport } = result;

      const proxy = httpProxy.createProxyServer();
      const esbuildProxy = httpProxy.createProxyServer({
        target: `http://localhost:${esbuildport}`,
      });

      proxy.on('error', (error) => {
        console.error('Backend');
        console.error('\t', error.message);
        console.error('\t', error.stack);
      });

      esbuildProxy.on('error', (error) => {
        console.error('Frontend');
        console.error('\t', error.message);
        console.error('\t', error.stack);
      });

      http
        .createServer((req, res) => {
          if (req.url.match(/static\/cayc/)) {
            // We need to remove the plugin "sub-directory". This is not part of the build output,
            // but is dynamically added by SonarQube. We build: `xxx.js`, but
            // SonarQube serves this under `/static/cayc/xxx.js`.
            req.url = req.url.replace('static/cayc/', '');
            esbuildProxy.web(req, res);
          } else {
            proxy.web(
              req,
              res,
              {
                target: proxyTarget,
              },
              (e) => console.error('req error', e)
            );
          }
        })
        .listen(port);

      console.log(`server started: http://localhost:${port}`);
    })
    .catch((e) => console.error(e));
}

run();
