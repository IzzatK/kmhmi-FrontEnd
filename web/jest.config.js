/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
      // '^.+\\.(ts|tsx)?$': 'ts-jest',
      // "^.+\\.(js|jsx)$": "babel-jest"
      "^.+\\.[jt]sx?$": "babel-jest"
  },
  // moduleNameMapper: {
  //     '\\.(css|scss)$': '<rootDir>/tests/__mocks__/styleMock.js'
  // }
};