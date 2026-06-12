export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const auth = req.headers.authorization;

  // Poll task status
  if (req.method === "GET") {
    const { taskId } = req.query;
    const r = await fetch(
      `https://dashscope-intl.aliyuncs.com/api/v1/tasks/${taskId}`,
      { headers: { Authorization: auth } }
    );
    const data = await r.json();
    return res.status(200).json(data);
  }

  // Create video task
  try {
    const { prompt } = req.body;
    const response = await fetch(
      "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
          "X-DashScope-Async": "enable",
        },
        body: JSON.stringify({
          model: "happyhorse-1.0-t2v",
          input: { prompt },
          parameters: {
            resolution: "720P",
            duration: 5,
          },
        }),
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}