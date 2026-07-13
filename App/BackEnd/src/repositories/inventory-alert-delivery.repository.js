import { InventoryAlertDelivery } from '../models/index.js';

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
    return await InventoryAlertDelivery.create(data);
  }
};
