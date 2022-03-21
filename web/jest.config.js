/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: '<rootDir>/tests/test-env.js',
  transform: {
    // '^.+\\.(ts|tsx)?$': 'ts-jest',
    // "^.+\\.(js|jsx)$": "babel-jest"
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    // "/src/app.visual/",
    // "/src/app.config/"
  ],
  // moduleNameMapper: {
  //   '\\.(css|scss)$': '<rootDir>/tests/__mocks__/styleMock.js'
  // }
};