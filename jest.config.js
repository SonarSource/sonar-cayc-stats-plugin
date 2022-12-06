module.exports = {
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: ["src/main/ts/**/*.{ts,tsx,js}"],
  coverageReporters: ["lcovonly", "text"],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  moduleFileExtensions: ["ts", "tsx", "js"],
  setupFilesAfterEnv: ["<rootDir>/conf/jest-setup.js"],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["<rootDir>/config", "<rootDir>/node_modules", "<rootDir>/scripts"],
  testRegex: "(/__tests__/.*|\\-test)\\.(ts|tsx)$",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          target: "es2018",
        },
      },
    ],
  },
  transformIgnorePatterns: ["/node_modules/(?!(d3-.+))/"],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "build/test-results/test-jest",
        outputName: "junit.xml",
        ancestorSeparator: " > ",
        suiteNameTemplate: "{filename}",
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
      },
    ],
  ],
  testTimeout: 30000,
};
