import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      "https://crm.theintelligentrealtors.com/api/v1/Account",
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.ESPO_USER + ":" + process.env.ESPO_PASS
            ).toString("base64"),
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "API failed" });
  }
}
