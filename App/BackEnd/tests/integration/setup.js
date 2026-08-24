import 'dotenv/config';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET ||= 'integration-test-secret';
process.env.JWT_EXPIRES_IN ||= '15m';
process.env.FRONTEND_URL ||= 'http://localhost:3000';

if (!process.env.DB_NAME || !process.env.DB_NAME.toLowerCase().includes('test')) {
  throw new Error(
    'Las pruebas de integración requieren una base aislada cuyo DB_NAME contenga "test".'
  );
}
