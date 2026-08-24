export default {
  testEnvironment: 'node',
  setupFiles: ['./tests/integration/setup.js'],
  testMatch: ['**/tests/integration/**/*.test.js'],
  transform: {},
  testTimeout: 30_000
};
