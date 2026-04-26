import AuthUrls from "./app/auth/urls";
import SystemUrls from "./app/system/urls";
import InventoryUrls from "./app/system/inventory/urls";
import SaleUrls from "./app/system/sales/urls";

const AllUrls = {
   'index': '/',
   ...AuthUrls,
   ...SystemUrls,
   ...InventoryUrls,
   ...SaleUrls,
}

export default AllUrls;