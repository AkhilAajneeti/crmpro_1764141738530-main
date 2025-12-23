import api from "./api";

export const fetchAccounts = async () => {
  const res = await api.get("/Account");
  return res.data;
};

export const createAccount = async (payload) => {
  const formData = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  const res = await api.post("/Account", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res.data;
};

export const deleteAccount = async (id) => {
  const res = await api.delete(`/Account/${id}`, {
    deleted: true,
  });
  return res.data;
};
export const updateAccount = async (id, payload) => {
  const res = await api.put(`/Account/${id}`,payload);
  return res.data;
};
