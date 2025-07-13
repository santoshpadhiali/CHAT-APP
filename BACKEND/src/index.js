import express from "express";
import authRoutes from "./routes/auth.routs.js";
import messageRoutes from "./routes/message.routs.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app,server } from "./lib/socket.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ✅ Cookie parser
app.use(cookieParser());

// ✅ CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../FRONTANT/vite-project/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend","vite-project", "dist", "index.html"));
  });
}
// ✅ Start server
server.listen(PORT, () => {
  console.log("The app is running on the port: " + PORT);
  connectDB();
});
