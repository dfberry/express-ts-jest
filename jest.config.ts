/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  clearMocks: true,
  moduleFileExtensions: ["js", "ts", "json", "node"],
  roots: ["./"],
  testMatch: ["./**/*.test.ts"],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  transformIgnorePatterns: [
    "./node_modules/",
    "./dist/",
    "./files/",
    "./public/",
  ],
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    "ts-jest": {
      tsconfig: './tsconfig.json',
      useESM: true
    }
  }
};
