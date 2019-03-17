const {defaults} = require('jest-config');

module.exports = {
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    'ts',
  ],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.server.json',
    },
  },
  testMatch: [
    '<rootDir>/src/server/**/__tests__/*.+(ts)',
  ],
  preset: 'ts-jest',
}