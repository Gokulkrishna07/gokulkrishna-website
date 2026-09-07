// Production proxy for the chat widget (Vercel / Netlify functions style).
// Keeps ROUTEAI_API_KEY on the server — set it as an environment variable in your
// hosting dashboard, never as a VITE_ variable.

const ROUTE_AI = "https://routeai-backend-btbb.onrender.com/api/v1/chat";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.ROUTEAI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "ROUTEAI_API_KEY is not configured on the server" });
  }

  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.slice(0, 2000) : "";
  if (!prompt.trim()) {
    return res.status(400).json({ error: "prompt is required" });
  }

  try {
    const upstream = await fetch(ROUTE_AI, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key },
      body: JSON.stringify({ prompt }),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch {
    return res.status(502).json({ error: "Upstream request failed" });
  }
}
