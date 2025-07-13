
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

// GET all users except logged-in user
router.get("/user", protectRoute, getUsersForSidebar);

// GET messages with a specific user
router.get("/:id", protectRoute, getMessages);

// POST send a message to a user
router.post("/send/:id", protectRoute, sendMessages);

export default router;
