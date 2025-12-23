import axios from "axios";

export default async function handler(req, res) {
  try {
    const auth = Buffer.from(
     ` ${process.env.ESPO_USER}:${process.env.ESPO_PASS}`
    ).toString("base64");

    const response = await axios({
      method: req.method,
      url: "https://crm.theintelligentrealtors.com/api/v1/Account",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      data: req.method !== "GET" ? req.body : undefined,
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("SERVER ERROR:", err?.response?.data || err.message);

    res.status(err?.response?.status || 500).json({
      error: "Serverless function failed",
      details: err?.response?.data || null,
    });
  }
}