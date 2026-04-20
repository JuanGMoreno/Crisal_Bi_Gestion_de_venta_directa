import { Sale, SaleDetail, Client, Product, User, SaleDetailConsumption, EntryDetail } from '../models/index.js';

const saleInclude = [
  {
    model: Client,
    as: 'cliente',
    required: false
  },
  {
    model: User,
    as: 'usuario',
    required: false
  },
  {
    model: SaleDetail,
    as: 'detalles',
    required: false,
    include: [
      {
        model: Product,
        as: 'producto',
        required: false
      },
      {
        model: SaleDetailConsumption,
        as: 'consumos_stock',
        required: false,
        include: [
          {
            model: EntryDetail,
            as: 'detalle_ingreso',
            required: false
          }
        ]
      }
    ]
  }
];

export const SaleRepository = {
  findAllByDistributor: async (distributorId) => {
    return await Sale.findAll({
      where: { id_distribuidor: distributorId },
      include: saleInclude,
      order: [['fecha_venta', 'DESC'], ['createdAt', 'DESC']]
    });
  },

  findByIdAndDistributor: async (id, distributorId, options = {}) => {
    const { transaction } = options;
    return await Sale.findOne({
      where: {
        id_venta: id,
        id_distribuidor: distributorId
      },
      include: saleInclude,
      transaction
    });
  },

  create: async (saleData, details, options = {}) => {
    const { transaction } = options;
    const sale = await Sale.create(saleData, { transaction });

    const payload = details.map((detail) => ({
      ...detail,
      id_venta: sale.id_venta
    }));

    const createdDetails = await SaleDetail.bulkCreate(payload, {
      transaction,
      returning: true
    });

    return { sale, details: createdDetails };
  },

  createDetailConsumptions: async (payload, options = {}) => {
    const { transaction } = options;
    return await SaleDetailConsumption.bulkCreate(payload, {
      transaction,
      returning: true
    });
  },

  updateStatusByDistributor: async (id, distributorId, estado, options = {}) => {
    const { transaction } = options;
    const sale = await Sale.findOne({
      where: {
        id_venta: id,
        id_distribuidor: distributorId
      },
      transaction
    });

    if (!sale) return null;

    return await sale.update({ estado }, { transaction });
  }
};
