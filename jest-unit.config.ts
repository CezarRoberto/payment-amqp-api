import jestConfig from './jest.config';

export default {
  ...jestConfig,
  collectCoverageFrom: ['<rootDir>/src/application/**/usecases/*UseCase.ts'],
  testRegex: '.*\\.*spec\\.ts$',
};
