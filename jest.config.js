module.exports = {
  // setupFiles: ['movie-api/test/setup/setupfiles.js'],
  // globalSetup: './test/setup/jestGlobalSetup.js',
  // globalTeardown: './test/setup/jestGlobalTeardown.js',
  testTimeout: 10000,
  testEnvironment: 'node',
  restoreMocks: true,
  coveragePathIgnorePatterns: [
    'node_modules',
    'src/config',
    'src/app.js',
    'tests',
  ],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  collectCoverage: true,
  //  mongodbMemoryServerOptions: {
  //   instance: {
  //     dbName: 'jest-test',
  //   },
  //   binary: {
  //     version: 'latest',
  //     skipMD5: true,
  //   },
  //   autoStart: false,
  // }
  // moduleFileExtensions: ['js', 'json'],
  //   testMatch: ['**/test/**/*.js'],
};
