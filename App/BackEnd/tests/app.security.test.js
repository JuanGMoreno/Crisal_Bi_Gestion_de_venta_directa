import request from 'supertest';
import app from '../src/app.js';
import { signAccessToken } from '../src/utils/jwt.js';

describe('API security boundaries', () => {
  test('expone cabeceras de seguridad', async () => {
    const response = await request(app).get('/api/docs/openapi.json');

    expect(response.status).toBe(200);
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
  });

  test('rechaza origenes CORS no configurados', async () => {
    const response = await request(app)
      .get('/api/docs/openapi.json')
      .set('Origin', 'https://evil.test');

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Origen no permitido');
  });

  test('ya no expone endpoints globales de negocios', async () => {
    const token = signAccessToken({ id: 'user-1', email: 'user@crisal.test' });

    const [listResponse, detailResponse] = await Promise.all([
      request(app).get('/api/distributors').set('Authorization', `Bearer ${token}`),
      request(app).get('/api/distributors/business-2').set('Authorization', `Bearer ${token}`)
    ]);

    expect(listResponse.status).toBe(404);
    expect(detailResponse.status).toBe(404);
  });

  test('rechaza mutaciones autenticadas por cookie sin origen', async () => {
    const response = await request(app)
      .post('/api/auth/signout')
      .set('Cookie', 'access_token=cookie-token');

    expect(response.status).toBe(403);
  });
});
