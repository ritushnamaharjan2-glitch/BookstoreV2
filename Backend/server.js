console.log("Using server file:", import.meta.url);


import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./db.js";
import lessonsRouter from "./routes/lessons.js";
import ordersRouter from "./routes/orders.js";
import usersRouter from "./routes/users.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Basic middleware
app.use(cors());
app.use(express.json());

// Static image handler
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesPath = path.join(__dirname, "images");

app.use("/images", express.static(imagesPath));



app.use("/lessons", lessonsRouter);
app.use("/orders", ordersRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Backend is running !");
});

// 404 only for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
  );
}

startServer();

