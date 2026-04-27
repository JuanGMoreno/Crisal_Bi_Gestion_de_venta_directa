export const schemas = {
  MessageResponse: {
    type: 'object',
    properties: {
      message: { type: 'string' }
    }
  },
  ErrorResponse: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      error: { type: 'string' }
    }
  },
  AuthUser: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      email: { type: 'string', format: 'email' }
    }
  },
  SignupRequest: {
    type: 'object',
    required: ['nombre', 'correo', 'contraseña'],
    properties: {
      nombre: { type: 'string' },
      correo: { type: 'string', format: 'email' },
      contraseña: { type: 'string', minLength: 6 }
    }
  },
  SigninRequest: {
    type: 'object',
    required: ['correo', 'contraseña'],
    properties: {
      correo: { type: 'string', format: 'email' },
      contraseña: { type: 'string' }
    }
  },
  Distributor: {
    type: 'object',
    properties: {
      id_distribuidor: { type: 'string', format: 'uuid' },
      id_usuario: { type: 'string', format: 'uuid' },
      nombre: { type: 'string' },
      rol: { type: 'string', enum: ['Consultora', 'Lider de Grupo', 'Lider'] },
      foto_avatar: { type: 'string', nullable: true },
      codigo_referido: { type: 'string', nullable: true },
      fecha_vencimiento_codigo: { type: 'string', format: 'date-time', nullable: true },
      estado: { type: 'string', enum: ['Activo', 'Inactivo'] }
    }
  },
  DistributorProfile: {
    type: 'object',
    properties: {
      id_distribuidor: { type: 'string', format: 'uuid' },
      id_usuario: { type: 'string', format: 'uuid' },
      nombre: { type: 'string' },
      rol: { type: 'string', enum: ['Consultora', 'Lider de Grupo', 'Lider'] },
      foto_avatar: { type: 'string', nullable: true },
      codigo_referido: { type: 'string', nullable: true },
      fecha_vencimiento_codigo: { type: 'string', format: 'date-time', nullable: true },
      estado: { type: 'string', enum: ['Activo', 'Inactivo'] },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      usuario: {
        type: 'object',
        properties: {
          id_usuario: { type: 'string', format: 'uuid' },
          correo: { type: 'string', format: 'email' },
          estado: { type: 'string', enum: ['Activo', 'Inactivo'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      padre: {
        allOf: [{ $ref: '#/components/schemas/Distributor' }],
        nullable: true
      }
    }
  },
  RenewReferralCodeResponse: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      profile: { $ref: '#/components/schemas/DistributorProfile' }
    }
  },
  UpdateCurrentDistributorProfileRequest: {
    type: 'object',
    required: ['nombre'],
    properties: {
      nombre: { type: 'string' },
      foto_avatar: { type: 'string', nullable: true }
    }
  },
  CreateDistributorRequest: {
    type: 'object',
    required: ['id_usuario', 'nombre'],
    properties: {
      id_usuario: { type: 'string', format: 'uuid' },
      id_distribuidor_padre: { type: 'string', format: 'uuid', nullable: true },
      nombre: { type: 'string' },
      rol: { type: 'string', enum: ['Consultora', 'Lider de Grupo', 'Lider'] },
      foto_avatar: { type: 'string', nullable: true },
      codigo_referido: { type: 'string', nullable: true },
      fecha_vencimiento_codigo: { type: 'string', format: 'date-time', nullable: true },
      estado: { type: 'string', enum: ['Activo', 'Inactivo'] }
    }
  },
  Product: {
    type: 'object',
    properties: {
      id_producto: { type: 'string', format: 'uuid' },
      id_distribuidor: { type: 'string', format: 'uuid' },
      nombre: { type: 'string' },
      descripcion: { type: 'string', nullable: true },
      codigo: { type: 'string', maxLength: 4 },
      precio_base_venta: { type: 'number' },
      foto_avatar: { type: 'string', nullable: true },
      estado: { type: 'string', enum: ['Activo', 'Inactivo'] },
      categoria: {
        type: 'string',
        enum: [
          'Aromaterapia',
          'Bienestar emocional y mental',
          'Bienestar físico',
          'Bienestar dermo-cosmético'
        ]
      }
    }
  },
  Client: {
    type: 'object',
    properties: {
      id_cliente: { type: 'string', format: 'uuid' },
      nombre: { type: 'string' },
      cedula: { type: 'string' },
      direccion: { type: 'string', nullable: true },
      edad: { type: 'integer', nullable: true },
      numero_telefono: { type: 'string', nullable: true },
      foto_avatar: { type: 'string', nullable: true },
      estado: { type: 'string', enum: ['Activo', 'Inactivo'] }
    }
  },
  InventoryEntryDetail: {
    type: 'object',
    properties: {
      id_detalle_ingreso: { type: 'string', format: 'uuid' },
      id_producto: { type: 'string', format: 'uuid' },
      cantidad_inicial: { type: 'integer' },
      cantidad_disponible: { type: 'integer' },
      costo_unitario_compra: { type: 'number' },
      fecha_vencimiento: { type: 'string', format: 'date-time', nullable: true },
      numero_lote_fabricacion: { type: 'string', nullable: true },
      estado: { type: 'string', enum: ['Activo', 'Inactivo'] },
      producto: { $ref: '#/components/schemas/Product' }
    }
  },
  InventoryEntry: {
    type: 'object',
    properties: {
      id_ingreso: { type: 'string', format: 'uuid' },
      id_distribuidor: { type: 'string', format: 'uuid' },
      fecha_ingreso: { type: 'string', format: 'date-time' },
      observacion: { type: 'string', nullable: true },
      estado: { type: 'string', enum: ['Activo', 'Inactivo'] },
      detalles: {
        type: 'array',
        items: { $ref: '#/components/schemas/InventoryEntryDetail' }
      }
    }
  },
  InventorySummaryItem: {
    type: 'object',
    properties: {
      id_producto: { type: 'string', format: 'uuid' },
      nombre: { type: 'string' },
      codigo: { type: 'string' },
      categoria: { type: 'string' },
      stock_total: { type: 'integer' },
      lotes_activos: { type: 'integer' },
      costo_promedio_compra: { type: 'number' },
      proximas_fechas_vencimiento: {
        type: 'array',
        items: { type: 'string', format: 'date-time' }
      }
    }
  },
  SaleDetailConsumption: {
    type: 'object',
    properties: {
      id_consumo_detalle_venta: { type: 'string', format: 'uuid' },
      id_detalle_venta: { type: 'string', format: 'uuid' },
      id_detalle_ingreso: { type: 'string', format: 'uuid' },
      cantidad: { type: 'integer' }
    }
  },
  SaleDetail: {
    type: 'object',
    properties: {
      id_detalle_venta: { type: 'string', format: 'uuid' },
      id_producto: { type: 'string', format: 'uuid' },
      cantidad: { type: 'integer' },
      precio_unitario: { type: 'number' },
      descuento_unitario: { type: 'number' },
      subtotal: { type: 'number' },
      estado: { type: 'string', enum: ['Activo', 'Inactivo'] },
      producto: { $ref: '#/components/schemas/Product' },
      consumos_stock: {
        type: 'array',
        items: { $ref: '#/components/schemas/SaleDetailConsumption' }
      }
    }
  },
  Sale: {
    type: 'object',
    properties: {
      id_venta: { type: 'string', format: 'uuid' },
      id_distribuidor: { type: 'string', format: 'uuid' },
      id_usuario: { type: 'string', format: 'uuid', nullable: true },
      id_cliente: { type: 'string', format: 'uuid', nullable: true },
      fecha_venta: { type: 'string', format: 'date-time' },
      total: { type: 'number' },
      estado: { type: 'string', enum: ['Abierta', 'Cerrada', 'Anulada'] },
      cliente: { $ref: '#/components/schemas/Client' },
      detalles: {
        type: 'array',
        items: { $ref: '#/components/schemas/SaleDetail' }
      }
    }
  },
  CreateClientRequest: {
    type: 'object',
    required: ['nombre', 'cedula'],
    properties: {
      nombre: { type: 'string' },
      cedula: { type: 'string' },
      direccion: { type: 'string' },
      edad: { type: 'integer' },
      numero_telefono: { type: 'string' },
      foto_avatar: { type: 'string' },
      estado: { type: 'string', enum: ['Activo', 'Inactivo'] }
    }
  },
  CreateInventoryEntryRequest: {
    type: 'object',
    required: ['detalles'],
    properties: {
      fecha_ingreso: { type: 'string', format: 'date-time' },
      observacion: { type: 'string' },
      detalles: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id_producto', 'cantidad_inicial', 'costo_unitario_compra'],
          properties: {
            id_producto: { type: 'string', format: 'uuid' },
            cantidad_inicial: { type: 'integer' },
            costo_unitario_compra: { type: 'number' },
            fecha_vencimiento: { type: 'string', format: 'date-time', nullable: true },
            numero_lote_fabricacion: { type: 'string', nullable: true }
          }
        }
      }
    }
  },
  CreateSaleRequest: {
    type: 'object',
    required: ['id_cliente', 'detalles'],
    properties: {
      id_cliente: { type: 'string', format: 'uuid' },
      fecha_venta: { type: 'string', format: 'date-time', nullable: true },
      estado: { type: 'string', enum: ['Abierta', 'Cerrada'], default: 'Cerrada' },
      detalles: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id_producto', 'cantidad'],
          properties: {
            id_producto: { type: 'string', format: 'uuid' },
            cantidad: { type: 'integer' },
            precio_unitario: { type: 'number', nullable: true },
            descuento_unitario: { type: 'number', nullable: true }
          }
        }
      }
    }
  },
  UpdateInventoryEntryRequest: {
    type: 'object',
    required: ['detalles'],
    properties: {
      fecha_ingreso: { type: 'string', format: 'date-time' },
      observacion: { type: 'string' },
      detalles: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id_producto', 'cantidad_inicial', 'costo_unitario_compra'],
          properties: {
            id_producto: { type: 'string', format: 'uuid' },
            cantidad_inicial: { type: 'integer' },
            costo_unitario_compra: { type: 'number' },
            fecha_vencimiento: { type: 'string', format: 'date-time', nullable: true },
            numero_lote_fabricacion: { type: 'string', nullable: true }
          }
        }
      }
    }
  },
  UpdateSaleRequest: {
    type: 'object',
    required: ['id_cliente', 'detalles'],
    properties: {
      id_cliente: { type: 'string', format: 'uuid' },
      fecha_venta: { type: 'string', format: 'date-time', nullable: true },
      detalles: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id_producto', 'cantidad'],
          properties: {
            id_producto: { type: 'string', format: 'uuid' },
            cantidad: { type: 'integer' },
            precio_unitario: { type: 'number', nullable: true },
            descuento_unitario: { type: 'number', nullable: true }
          }
        }
      }
    }
  },
  UpdateSaleStatusRequest: {
    type: 'object',
    required: ['estado'],
    properties: {
      estado: { type: 'string', enum: ['Cerrada', 'Anulada'] }
    }
  }
};
