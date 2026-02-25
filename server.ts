import express from "express";
import bodyParser from "body-parser";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(bodyParser.json());

  // API routes go here
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // New API endpoint for publishing posts
  app.post("/api/publish-post", (req, res) => {
    const { title, author } = req.body;
    console.log("Received post for publishing:", title);
    // Here you would integrate with Blogger API or other publishing platform
    res.json({ success: true, message: "Post received for publishing", post: { title, author } });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
