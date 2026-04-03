import AuthUrls from "./app/auth/urls";
import SystemUrls from "./app/system/urls";

const AllUrls = {
   'index': '/',
   ...AuthUrls,
   ...SystemUrls,
}

export default AllUrls;