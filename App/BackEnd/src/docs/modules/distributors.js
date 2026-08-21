export const distributorsDocs = {
  tags: [{
    name: 'Distributors',
    description: 'Perfil operativo del negocio asociado a cada cuenta'
  }],
  paths: {
    '/distributors': {
      get: {
        tags: ['Distributors'],
        summary: 'Listar negocios activos',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: {
            description: 'Listado de negocios',
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
        summary: 'Crear negocio',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDistributorRequest' }
            }
          }
        },
        responses: { 201: { description: 'Negocio creado' } }
      }
    },
    '/distributors/me': {
      get: {
        tags: ['Distributors'],
        summary: 'Obtener el perfil del negocio autenticado',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: {
            description: 'Perfil del negocio autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DistributorProfile' }
              }
            }
          },
          404: { description: 'Negocio no encontrado' }
        }
      },
      put: {
        tags: ['Distributors'],
        summary: 'Actualizar el perfil del negocio autenticado',
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
          404: { description: 'Negocio no encontrado' }
        }
      }
    },
    '/distributors/{id}': {
      get: {
        tags: ['Distributors'],
        summary: 'Obtener negocio por id',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{
          in: 'path', name: 'id', required: true,
          schema: { type: 'string', format: 'uuid' }
        }],
        responses: {
          200: { description: 'Negocio encontrado' },
          404: { description: 'Negocio no encontrado' }
        }
      },
      put: {
        tags: ['Distributors'],
        summary: 'Actualizar negocio',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{
          in: 'path', name: 'id', required: true,
          schema: { type: 'string', format: 'uuid' }
        }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDistributorRequest' }
            }
          }
        },
        responses: { 200: { description: 'Negocio actualizado' } }
      },
      delete: {
        tags: ['Distributors'],
        summary: 'Eliminar negocio de forma lógica',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{
          in: 'path', name: 'id', required: true,
          schema: { type: 'string', format: 'uuid' }
        }],
        responses: { 200: { description: 'Negocio eliminado' } }
      }
    }
  }
};
