module.exports = {
  bail: false,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**"],
  modulePathIgnorePatterns: [".json"],
  coverageDirectory: "__tests__/coverage",
  coveragePathIgnorePatterns: ["src/config/*", "src/mock/*", "src/app/utils/*"],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js?(x)"],
};
