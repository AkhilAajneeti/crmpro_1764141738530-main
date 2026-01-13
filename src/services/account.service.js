/* GET */
export const fetchAccounts = async () => {
  const token = localStorage.getItem("auth_token");

  console.log("AUTH TOKEN:", token); // 🔍 debug

  const res = await fetch("https://gateway.aajneetiadvertising.com/Account", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: token, // ✅ backend expects this
    },
  });

  if (!res.ok) {
    console.log("STATUS:", res.status);

    if (res.status === 401 || res.status === 403) {
      localStorage.clear();
      window.location.href = "/login";
    }

    throw new Error("Failed to fetch accounts");
  }

  return await res.json();
};

/* CREATE */
export const createAccount = async (payload) => {
  const token = localStorage.getItem("auth_token");
  const res = await fetch("https://gateway.aajneetiadvertising.com/Account", {
    method: "POST",
    headers: { "Content-Type": "application/json", token: token },

    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error("account is not created");
  }
  // EspoCRM returns array
  return text ? JSON.parse(text) : null;
};

/* UPDATE */
export const updateAccount = async (id, payload, versionNumber) => {
  const token = localStorage.getItem("auth_token");
  console.log(id, payload, versionNumber);
  const res = await fetch(
    `https://gateway.aajneetiadvertising.com/Account/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "X-Version-Number": String(versionNumber||1),
        token: token,
      },
      body: JSON.stringify(payload),
    }
  );

  const text = await res.text();
  console.log("response front servicejs", res);
  if (!res.ok) {
    throw new Error(text || "Account update failed");
  }

  return text ? JSON.parse(text) : null;
};

/* DELETE */
export const deleteAccount = async (id) => {
  const token = localStorage.getItem("auth_token");
  const res = await fetch(
    `https://gateway.aajneetiadvertising.com/Account/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json", token: token },
    }
  );
  return res.json();
};

// 
// --------------Stream-----------
//fetch by Streams
export const fetchAccStreamById = async (id) => {
  console.log(id);
  const token = localStorage.getItem("auth_token");
  console.log("AUTH TOKEN:", token); // 🔍 debug
  const res = await fetch(
    `https://gateway.aajneetiadvertising.com/Account/${id}/stream`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        token: token,
      },
    }
  );

  console.log(res);
  if (!res.ok) {
    console.log("STATUS:", res.status);
    if (res.status === 401 || res.status === 403) {
      localStorage.clear();
      window.location.href = "/login";
    }
    throw new Error("Failed to fetch User's stream");
  }
  return await res.json();
};

//delete activity with notes api
export const deleteAccStream = async (id) => {
  const token = localStorage.getItem("auth_token");
  const res = await fetch(
    `https://gateway.aajneetiadvertising.com/Note/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json", token: token },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to delete Activity");
  }
  return res.json();
};

//create strean
export const createAccStream = async (payload) => {
  console.log(payload);
  const token = localStorage.getItem("auth_token");
  const res = await fetch("https://gateway.aajneetiadvertising.com/Note", {
    method: "POST",
    headers: { "Content-Type": "application/json", token: token },

    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("API ERROR:", text);
    throw new Error("Activity is not created", text);
  }
  // EspoCRM returns array
  return text ? JSON.parse(text) : null;
};

// Meet call related Activities

export const accActivitesById = async (id) => {
  console.log(id);
  const token = localStorage.getItem("auth_token");
  console.log("AUTH TOKEN:", token); // 🔍 debug
  const res = await fetch(
    `https://gateway.aajneetiadvertising.com/Activities/Account/${id}/activities`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        token: token,
      },
    }
  );

  console.log(res);
  if (!res.ok) {
    console.log("STATUS:", res.status);
    if (res.status === 401 || res.status === 403) {
      localStorage.clear();
      window.location.href = "/login";
    }
    throw new Error("Failed to fetch Accounts Activties");
  }
  return await res.json();
};