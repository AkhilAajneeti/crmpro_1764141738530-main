

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "", // same domain (vercel)
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

export default api;
