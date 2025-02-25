/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: [
    "<rootDir>/tests/unit-tests/**/*.test.ts",
    "<rootDir>/tests/integration-tests/**/*.test.ts",
  ],
  coverageDirectory: "coverage",
  moduleFileExtensions: ["ts", "js", "json"],
};
