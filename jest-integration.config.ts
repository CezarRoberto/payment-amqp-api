import jestConfig from './jest.config';

export default {
  ...jestConfig,
  collectCoverageFrom: [
    '<rootDir>/src/application/**/controllers/*Controller.ts',
  ],
  testRegex: '.*\\.test\\.ts$',
};
