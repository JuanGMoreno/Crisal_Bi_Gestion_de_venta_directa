export const distributorsDocs = {
  tags: [{
    name: 'Distributors',
    description: 'Perfil operativo del negocio asociado a la cuenta autenticada'
  }],
  paths: {
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
    }
  }
};
