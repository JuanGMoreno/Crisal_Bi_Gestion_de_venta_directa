// Importar todos los modelos
import User from './User.js';
import Distributor from './Distributor.js';
import Product from './Product.js';
import InventoryIncome from './inventory_income.js';
import EntryDetail from './entry_details.js';
import Client from './Client.js';
import Sale from './Sale.js';
import SaleDetail from './SaleDetail.js';
import SaleDetailConsumption from './SaleDetailConsumption.js';

// Importar las asociaciones
import './associations.js';

// Exportar todos los modelos
export {
  User,
  Distributor,
  Product,
  InventoryIncome,
  EntryDetail,
  Client,
  Sale,
  SaleDetail,
  SaleDetailConsumption
};
