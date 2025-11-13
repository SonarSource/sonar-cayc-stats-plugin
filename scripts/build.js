/*
 * Clean as You Code Plugin
 * Copyright (C) 2022-2025 SonarSource Sàrl
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
