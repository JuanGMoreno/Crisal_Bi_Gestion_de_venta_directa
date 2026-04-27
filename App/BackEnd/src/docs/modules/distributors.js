export const distributorsDocs = {
  tags: [{ name: 'Distributors', description: 'Gestion de distribuidores' }],
  paths: {
    '/distributors': {
      get: {
        tags: ['Distributors'],
        summary: 'Listar distribuidores activos',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: {
            description: 'Listado de distribuidores',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Distributor' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Distributors'],
        summary: 'Crear distribuidor',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDistributorRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Distribuidor creado' }
        }
      }
    },
    '/distributors/me': {
      get: {
        tags: ['Distributors'],
        summary: 'Obtener el perfil del distribuidor autenticado',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: {
            description: 'Perfil del distribuidor autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DistributorProfile' }
              }
            }
          },
          404: { description: 'Distribuidor no encontrado' }
        }
      },
      put: {
        tags: ['Distributors'],
        summary: 'Actualizar el perfil del distribuidor autenticado',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/UpdateCurrentDistributorProfileRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Perfil actualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DistributorProfile' }
              }
            }
          },
          404: { description: 'Distribuidor no encontrado' }
        }
      },
      post: {
        tags: ['Distributors'],
        summary: 'Solicitar un nuevo codigo de referido cuando el actual haya vencido',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: {
            description: 'Codigo de referido renovado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RenewReferralCodeResponse' }
              }
            }
          },
          400: { description: 'El codigo actual aun se encuentra vigente' },
          404: { description: 'Distribuidor no encontrado' }
        }
      }
    },
    '/distributors/{id}': {
      get: {
        tags: ['Distributors'],
        summary: 'Obtener distribuidor por id',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Distribuidor encontrado' },
          404: { description: 'Distribuidor no encontrado' }
        }
      },
      put: {
        tags: ['Distributors'],
        summary: 'Actualizar distribuidor',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDistributorRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Distribuidor actualizado' }
        }
      },
      delete: {
        tags: ['Distributors'],
        summary: 'Eliminar distribuidor de forma logica',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          200: { description: 'Distribuidor eliminado' }
        }
      }
    }
  }
};
