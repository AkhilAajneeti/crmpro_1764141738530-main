import axios from "axios";

const username ="prashant_test_admin";
const password = "79pmYKy34C}";

const basicAuthToken = btoa(`${username}:${password}`);

const api = axios.create({
  baseURL:"",
  headers: {
    Authorization: `Basic ${basicAuthToken}`,
    "Content-Type": "application/json",
  },
});

export default api;
