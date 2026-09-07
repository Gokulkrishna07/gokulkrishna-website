import express from "express";
import handler from "./chat.js";

const app = express();
app.use(express.json());
app.post("/api/chat", handler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`portfolio-api listening on 127.0.0.1:${PORT}`);
});
