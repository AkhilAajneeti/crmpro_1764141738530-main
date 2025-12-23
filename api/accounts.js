export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    // Safety check for env vars
    if (!process.env.ESPO_USER || !process.env.ESPO_PASS) {
      return new Response(
        JSON.stringify({ error: "Missing ESPO credentials" }),
        { status: 500 }
      );
    }

    // Create Basic Auth header (Edge compatible)
    const auth = btoa(
      `${process.env.ESPO_USER}:${process.env.ESPO_PASS}`
    );

    const response = await fetch(
      "https://crm.theintelligentrealtors.com/api/v1/Account",
      {
        method: req.method,
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Vercel proxy failed",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}