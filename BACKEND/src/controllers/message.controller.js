import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecevierSoketId, io } from "../lib/socket.js";

// ✅ 1. Get users for sidebar (excluding current user)
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("❌ Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ 2. Get messages between logged-in user and selected user
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error at getMessages controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ 3. Send a new message (with optional image)
export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;

    // Optional: upload image if provided
    if (image && typeof image === 'string') {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'chat_images',
      });
      imageUrl = uploadResponse.secure_url;
    }

    // Validate that at least text or image is present
    if (!text && !imageUrl) {
      return res.status(400).json({ message: "Text or image is required." });
    }

    // Create and save message
    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
    });

    await newMessage.save();

    // ✅ Emit new message via socket if receiver is online
    const receiverSocketId = getRecevierSoketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Error at sendMessages controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
