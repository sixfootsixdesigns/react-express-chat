const {defaults} = require('jest-config');

module.exports = {
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    "ts",
    "tsx"
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    "^.+\\.(css|scss|sass)$": "<rootDir>/config/jest/styleMock.js"
  },
  testMatch: [
    "<rootDir>/src/client/**/?(*.)(spec|test).{ts,tsx}"
  ]
}
