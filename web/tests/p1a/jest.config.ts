import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

export default createJestConfig({
  rootDir: "../..",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  setupFiles: ["<rootDir>/jest.env.setup.js"],
  moduleNameMapper: {
    "^@/lib/supabaseClient$": "<rootDir>/__mocks__/@/lib/supabaseClient.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/tests/p1a/**/*.test.ts"],
});
