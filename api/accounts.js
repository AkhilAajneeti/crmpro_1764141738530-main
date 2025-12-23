import axios from "axios";

export default async function handler(req, res) {
  try {
    const auth = Buffer.from(
      `${process.env.ESPO_USER}:${process.env.ESPO_PASS}`
    ).toString("base64");

    const response = await axios({
      method: req.method,
      url: "https://crm.theintelligentrealtors.com/api/v1/Account",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      data: req.body,
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("SERVER ERROR:", err?.response?.data || err.message);
    res.status(500).json({ error: "Serverless function failed" });
  }
}
