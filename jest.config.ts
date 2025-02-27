import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const jestConfigTsc = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  modulePaths: ['<rootDir>'],
  transform: {
    '^.+\\.(t|j)s$': ['@swc/jest'],
  },
  moduleDirectories: ['node_modules'],
  transformIgnorePatterns: ['./node_modules/'],
  modulePathIgnorePatterns: ['<rootDir>/.*/__mocks__'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  setupFiles: ['./jest-setup.ts'],
  coveragePathIgnorePatterns: [
    'fixtures',
    '__fixtures__',
    '<rootDir>/node_modules',
    '<rootDir>/.build',
    '<rootDir>/.clinic',
    '<rootDir>/.serverless',
    '<rootDir>/coverage',
    '<rootDir>/gen',
    '<rootDir>/src/main.ts',
    '<rootDir>/src/index.ts',
    '<rootDir>/src/app/app.ts',
    '<rootDir>/src/app/swagger',
    '<rootDir>/src/aws',
    'interfaces',
    'types',
    'config',
    'tests',
    'mocks',
    '_libs',
    'dist',
    'eslint.config.mjs',
  ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>',
    }),
  },
};

export default jestConfigTsc;
