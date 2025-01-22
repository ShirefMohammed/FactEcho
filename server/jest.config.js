/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { isolatedModules: true }], // Move ts-jest config here
  },
  testPathIgnorePatterns: ["./node_modules/", "./build/"],
};
