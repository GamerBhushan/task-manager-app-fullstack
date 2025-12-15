import type { Config } from 'jest';

const config: Config = {
  // Use the ESM preset for ts-jest
  preset: 'ts-jest/presets/default-esm', 
  testEnvironment: 'node',
  
  // Force Jest to treat .ts files as ESM
  extensionsToTreatAsEsm: ['.ts'], 
  
  // Handle the ".js" extension imports used in your source code
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  
  // Configure ts-jest to use ESM
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};

export default config;