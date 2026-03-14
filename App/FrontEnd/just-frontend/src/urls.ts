import AuthUrls from "./app/auth/urls";
import DashboardUrls from "./app/dashboard/urls";

const AllUrls = {
   'index': '/',
   ...AuthUrls,
   ...DashboardUrls,
}

export default AllUrls;