import { meController } from '../src/controllers/auth.controller.js';
import { authMiddleware } from '../src/middleware/auth.middleware.js';
import { signAccessToken } from '../src/utils/jwt.js';

describe('Auth middleware and protected session', () => {
  test('acepta token valido y construye req.user para rutas protegidas', () => {
    const token = signAccessToken({
      id: 'user-1',
      email: 'ana@correo.com'
    });
    const req = {
      headers: {
        authorization: `Bearer ${token}`
      },
      cookies: {}
    };
    let receivedError;

    authMiddleware(req, {}, (error) => {
      receivedError = error;
    });

    expect(receivedError).toBeUndefined();
    expect(req.user).toEqual({
      id: 'user-1',
      email: 'ana@correo.com'
    });
  });

  test('rechaza peticion protegida sin token', () => {
    const req = {
      headers: {},
      cookies: {}
    };
    let receivedError;

    authMiddleware(req, {}, (error) => {
      receivedError = error;
    });

    expect(receivedError.status).toBe(401);
    expect(receivedError.message).toBe('No autenticado');
  });

  test('me devuelve el usuario autenticado', async () => {
    const req = {
      user: {
        id: 'user-1',
        email: 'ana@correo.com'
      }
    };
    let response;
    const res = {
      json(payload) {
        response = payload;
        return payload;
      }
    };

    await meController(req, res);

    expect(response).toEqual({
      message: 'Ruta protegida',
      user: req.user
    });
  });
});
