import { originProtectionMiddleware, isAllowedOrigin } from '../src/middleware/security.middleware.js';

describe('Security middleware', () => {
  test('acepta solamente los origenes configurados', () => {
    process.env.FRONTEND_URLS = 'https://app.crisal.test,https://www.crisal.test';

    expect(isAllowedOrigin('https://app.crisal.test')).toBe(true);
    expect(isAllowedOrigin('https://www.crisal.test/')).toBe(true);
    expect(isAllowedOrigin('https://evil.test')).toBe(false);

    delete process.env.FRONTEND_URLS;
  });

  test('rechaza mutaciones con cookie desde un origen no permitido', () => {
    const req = {
      method: 'POST',
      headers: { origin: 'https://evil.test' },
      cookies: { access_token: 'cookie-token' }
    };
    let receivedError;

    originProtectionMiddleware(req, {}, (error) => {
      receivedError = error;
    });

    expect(receivedError.status).toBe(403);
    expect(receivedError.message).toMatch(/origen no permitido/i);
  });

  test('permite autenticacion bearer sin depender de cookies', () => {
    const req = {
      method: 'POST',
      headers: { authorization: 'Bearer api-token' },
      cookies: { access_token: 'cookie-token' }
    };
    let receivedError;

    originProtectionMiddleware(req, {}, (error) => {
      receivedError = error;
    });

    expect(receivedError).toBeUndefined();
  });
});
