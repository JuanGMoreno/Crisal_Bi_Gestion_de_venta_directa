import { InventoryAlertDelivery } from '../models/index.js';

function isDailyUniqueConstraintError(error) {
  return (
    error?.name === 'SequelizeUniqueConstraintError' &&
    (error?.parent?.constraint === 'inventory_alert_daily_unique' ||
      error?.original?.constraint === 'inventory_alert_daily_unique')
  );
}

export const InventoryAlertDeliveryRepository = {
  findByDailyKey: async ({ distributorId, productId, alertType, alertDate }) => {
    return await InventoryAlertDelivery.findOne({
      where: {
        id_distribuidor: distributorId,
        id_producto: productId,
        alert_type: alertType,
        alert_date: alertDate
      }
    });
  },

  create: async (data) => {
    try {
      return await InventoryAlertDelivery.create(data);
    } catch (error) {
      if (!isDailyUniqueConstraintError(error)) {
        throw error;
      }

      return await InventoryAlertDeliveryRepository.findByDailyKey({
        distributorId: data.id_distribuidor,
        productId: data.id_producto,
        alertType: data.alert_type,
        alertDate: data.alert_date
      });
    }
  }
};
