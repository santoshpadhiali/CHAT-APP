import express from "express";
import authRoutes from "./routes/auth.routs.js";
import messageRoutes from "./routes/message.routs.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173", // ✅ Update if frontend hosted elsewhere
  credentials: true
}));

// API Routes
console.log("authRoutes:", authRoutes);
console.log("messageRoutes:", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Additional demo/user routes (to replace buggy ones)
app.get("/user/:id", (req, res) => {
  res.send(`User ID is ${req.params.id}`);
});

app.get("/user/:username/profile", (req, res) => {
  res.send(`Profile page for ${req.params.username}`);
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../FRONTANT/vite-project/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../FRONTANT", "vite-project", "dist", "index.html"));
  });
}

// Start server
server.listen(PORT, () => {
  console.log("✅ Server running on port:", PORT);
  connectDB();
});
