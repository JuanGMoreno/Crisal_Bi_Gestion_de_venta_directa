export const authDocs = {
  tags: [{ name: 'Auth', description: 'Autenticacion y sesion' }],
  paths: {
    '/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SignupRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Usuario creado' },
          400: { description: 'Payload invalido' }
        }
      }
    },
    '/auth/signin': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesion',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SigninRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Sesion iniciada' },
          401: { description: 'Credenciales invalidas' }
        }
      }
    },
    '/auth/signout': {
      post: {
        tags: ['Auth'],
        summary: 'Cerrar sesion',
        responses: {
          200: { description: 'Sesion cerrada' }
        }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Obtener usuario autenticado',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: { description: 'Sesion valida' },
          401: { description: 'No autenticado' }
        }
      }
    }
  }
};
