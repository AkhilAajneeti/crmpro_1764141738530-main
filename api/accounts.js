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

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("ESPO ERROR:", error?.response?.data || error.message);

    return res.status(error?.response?.status || 500).json({
      message: "EspoCRM API failed",
      details: error?.response?.data || error.message,
    });
  }
}
