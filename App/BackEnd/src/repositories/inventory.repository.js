import { Distributor, EntryDetail, InventoryIncome, Product, SaleDetailConsumption } from '../models/index.js';

const entryInclude = [
  {
    model: Distributor,
    as: 'distribuidor',
    required: false
  },
  {
    model: EntryDetail,
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
        as: 'consumos_venta',
        required: false
      }
    ]
  }
];

export const InventoryRepository = {
  findEntriesByDistributor: async (distributorId) => {
    return await InventoryIncome.findAll({
      where: {
        id_distribuidor: distributorId,
        estado: 'Activo'
      },
      include: entryInclude,
      order: [['fecha_ingreso', 'DESC'], ['createdAt', 'DESC']]
    });
  },

  findEntryByIdAndDistributor: async (id, distributorId, options = {}) => {
    const { transaction } = options;

    return await InventoryIncome.findOne({
      where: {
        id_ingreso: id,
        id_distribuidor: distributorId
      },
      include: entryInclude,
      transaction
    });
  },

  createEntry: async (entryData, detailData, options = {}) => {
    const { transaction } = options;
    const entry = await InventoryIncome.create(entryData, { transaction });

    await EntryDetail.bulkCreate(
      detailData.map((detail) => ({
        ...detail,
        id_ingreso: entry.id_ingreso
      })),
      { transaction }
    );

    return await InventoryRepository.findEntryByIdAndDistributor(
      entry.id_ingreso,
      entry.id_distribuidor,
      { transaction }
    );
  },

  replaceEntryDetails: async (entryId, detailData, options = {}) => {
    const { transaction } = options;

    await EntryDetail.destroy({
      where: { id_ingreso: entryId },
      transaction
    });

    await EntryDetail.bulkCreate(
      detailData.map((detail) => ({
        ...detail,
        id_ingreso: entryId
      })),
      { transaction }
    );
  },

  updateEntryByDistributor: async (id, distributorId, payload, options = {}) => {
    const { transaction } = options;
    const entry = await InventoryIncome.findOne({
      where: {
        id_ingreso: id,
        id_distribuidor: distributorId
      },
      transaction
    });

    if (!entry) return null;

    return await entry.update(payload, { transaction });
  },

  findActiveStockDetailsByDistributor: async (distributorId) => {
    return await EntryDetail.findAll({
      where: {
        estado: 'Activo'
      },
      include: [
        {
          model: InventoryIncome,
          as: 'ingreso',
          required: true,
          where: {
            id_distribuidor: distributorId,
            estado: 'Activo'
          }
        },
        {
          model: Product,
          as: 'producto',
          required: true
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  },

  findConsumableStockDetailsByProducts: async (distributorId, productIds, options = {}) => {
    const { transaction } = options;

    return await EntryDetail.findAll({
      where: {
        id_producto: productIds,
        estado: 'Activo'
      },
      include: [
        {
          model: InventoryIncome,
          as: 'ingreso',
          required: true,
          where: {
            id_distribuidor: distributorId,
            estado: 'Activo'
          }
        }
      ],
      transaction,
      lock: transaction ? transaction.LOCK.UPDATE : undefined
    });
  },

  updateAvailableQuantity: async (entryDetailId, cantidadDisponible, options = {}) => {
    const { transaction } = options;
    const entryDetail = await EntryDetail.findByPk(entryDetailId, { transaction });
    if (!entryDetail) return null;
    return await entryDetail.update({ cantidad_disponible: cantidadDisponible }, { transaction });
  },

  incrementAvailableQuantity: async (entryDetailId, amount, options = {}) => {
    const { transaction } = options;
    const entryDetail = await EntryDetail.findByPk(entryDetailId, { transaction });
    if (!entryDetail) return null;

    const restoredQuantity = Number(entryDetail.cantidad_disponible) + Number(amount);

    // Cuando una venta se anula, el lote debe volver a quedar plenamente
    // disponible para los resúmenes y futuras salidas de inventario.
    return await entryDetail.update(
      {
        cantidad_disponible: restoredQuantity,
        estado: 'Activo'
      },
      { transaction }
    );
  },

  softDeleteEntryByDistributor: async (id, distributorId) => {
    const entry = await InventoryIncome.findOne({
      where: {
        id_ingreso: id,
        id_distribuidor: distributorId
      },
      include: [
        {
          model: EntryDetail,
          as: 'detalles',
          required: false
        }
      ]
    });

    if (!entry) return null;

    await entry.update({ estado: 'Inactivo' });
    await EntryDetail.update(
      { estado: 'Inactivo' },
      {
        where: { id_ingreso: entry.id_ingreso }
      }
    );

    return entry;
  }
};
