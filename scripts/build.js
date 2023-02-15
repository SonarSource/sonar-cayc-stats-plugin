/*
 * Copyright (C) 2017-2022 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
/* eslint-disable no-console*/
const fs = require('fs-extra');
const esbuild = require('esbuild');
const path = require('path');
const { performance } = require('perf_hooks');

const getConfig = require('../conf/esbuild-config');

const release = process.argv.findIndex((val) => val === 'release') >= 0;

function clean() {
  fs.emptyDirSync(path.join(__dirname, '../build/webapp'));
}

async function build() {
  const start = performance.now();
  console.log(`Creating ${release ? 'optimized' : 'fast'} production build...`);
  console.log();

  await esbuild.build(getConfig(release));

  console.log('Compiled successfully!');
  console.log(Math.round(performance.now() - start), 'ms');
  console.log();
}

(async () => {
  clean();
  await build();
})();
