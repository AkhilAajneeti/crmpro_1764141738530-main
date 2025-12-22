import api from "./api";

export const fetchAccounts = async () => {
  const res = await api.get("/Account");
  return res.data;
};  
