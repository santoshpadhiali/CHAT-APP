import { Server } from "socket.io";
import http from "http";
import express from "express";

// Create express app and HTTP server
const app = express();
const server = http.createServer(app);

// Create socket.io instance
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// ✅ Global map to track userId -> socketId
export const userSocketMap = {};

// ✅ Helper to get a socket ID by user ID
export function getRecevierSoketId(userId) {
  return userSocketMap[userId];
}

// ✅ Socket.IO connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(" A user connected:", socket.id, "User ID:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    console.log(" A user disconnected:", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

// ✅ Export for server startup
export { io, app, server };
