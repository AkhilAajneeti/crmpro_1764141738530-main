// import axios from "axios";

// const username ="prashant_test_admin";
// const password = "79pmYKy34C}";

// const basicAuthToken = btoa(`${username}:${password}`);

// const api = axios.create({
//   baseURL:"",
//   headers: {
//     Authorization: `Basic ${basicAuthToken}`,
//     "Content-Type": "application/json",
//   },
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "", // same domain (vercel)
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

export default api;
