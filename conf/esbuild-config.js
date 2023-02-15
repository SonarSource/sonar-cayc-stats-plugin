/*
 * Copyright (C) 2017-2022 SonarSource SA
 * All rights reserved
 * mailto:info AT sonarsource DOT com
 */
const TARGET_BROWSERS = ["chrome58", "firefox57", "safari11", "edge18"];

module.exports = (release) => ({
  entryPoints: ["./src/main/ts/stats.tsx"],
  outdir: "target/classes/static",
  tsconfig: "./tsconfig.json",
  define: {
    "process.cwd": "dummy_process_cwd",
  },
  bundle: true,
  minify: release,
  sourcemap: !release,
  target: TARGET_BROWSERS,
  plugins: [
    importAsGlobals({
      "date-fns": "DateFns",
      react: "React",
      "react-dom": "ReactDOM",
      "react-intl": "ReactIntl",
      "sonar-request": "SonarRequest",
      i18n: "window",
    }),
  ],
});

// See https://github.com/evanw/esbuild/issues/337
function importAsGlobals(mapping) {
  const escRe = (s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const filter = new RegExp(
    Object.keys(mapping)
      .map((moduleName) => `^${escRe(moduleName)}$`)
      .join("|")
  );

  return {
    name: "import-as-globals",
    setup(build) {
      build.onResolve({ filter }, (args) => {
        if (!mapping[args.path]) {
          throw new Error("Unknown global: " + args.path);
        }
        return {
          path: args.path,
          namespace: "external-global",
        };
      });

      build.onLoad(
        {
          filter,
          namespace: "external-global",
        },
        (args) => {
          const globalName = mapping[args.path];
          return {
            contents: `module.exports = ${globalName};`,
            loader: "js",
          };
        }
      );
    },
  };
}
