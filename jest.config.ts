import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'node',
  roots: ['./src'],
  testMatch: [
    '**/__tests__/**/*.+(js|ts)',
    '**/?(*.)+(spec|test).+(js|ts)',
  ],
  moduleFileExtensions: ['js', 'json', 'ts', 'node'],
};

export default config;
