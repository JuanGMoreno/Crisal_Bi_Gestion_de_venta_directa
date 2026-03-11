// Importar todos los modelos
import User from './User.js';
import Distributor from './Distributor.js';
import Inventory from './Inventory.js';
import Batch from './Batch.js';
import Product from './Product.js';
import ProductBatch from './ProductBatch.js';
import Client from './Client.js';
import Sale from './Sale.js';
import SaleDetail from './SaleDetail.js';

// Importar las asociaciones
import './associations.js';

// Exportar todos los modelos
export {
  User,
  Distributor,
  Inventory,
  Batch,
  Product,
  ProductBatch,
  Client,
  Sale,
  SaleDetail
};
