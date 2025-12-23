// import api from "./api";

// export const fetchAccounts = async () => {
//   const res = await api.get("/api/accounts");
//   return res.data;
// };

// export const createAccount = async (payload) => {
//   const formData = new URLSearchParams();

//   Object.entries(payload).forEach(([key, value]) => {
//     if (value !== "" && value !== null && value !== undefined) {
//       formData.append(key, value);
//     }
//   });

//   const res = await api.post("/Account", formData, {
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   });

//   return res.data;
// };

// export const deleteAccount = async (id) => {
//   const res = await api.delete(`/Account/${id}`, {
//     deleted: true,
//   });
//   return res.data;
// };
// export const updateAccount = async (id, payload) => {
//   const res = await api.put(`/Account/${id}`,payload);
//   return res.data;
// };
import api from "./api";
const isLocal = location.hostname === "localhost";

const url = isLocal
  ? "/api/accounts.local"
  : "/api/accounts";
/* GET */
export const fetchAccounts = async () => {
  const res = await api.get(url);
  return res.data;
};

/* CREATE */
export const createAccount = async (payload) => {
  const res = await api.post("/api/accounts", payload);
  return res.data;
};

/* UPDATE */
export const updateAccount = async (id, payload) => {
  const res = await api.put(`/api/accounts?id=${id}`, payload);
  return res.data;
};

/* DELETE */
export const deleteAccount = async (id) => {
  const res = await api.delete(`/api/accounts?id=${id}`);
  return res.data;
};
