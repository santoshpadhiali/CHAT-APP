import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstant } from "../lib/axios.js";
import { useAuthStore } from "../stor/useAuthStor.js"; // ✅ double-check spelling

export const useChatStor = create((set, get) => ({
  users: [],
  selectedUser: null,
  messages: [],
  isUsersLoading: false,
  isMessagesLoading: false,

  // ✅ Fetch all users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstant.get("/messages/user");
      set({ users: res.data });
      toast.success("Users loaded successfully");
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ✅ Fetch messages with selected user
  getMessages: async (userId) => {
    if (!userId) {
      toast.error("User ID is missing");
      return;
    }

    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstant.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      toast.error(error?.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // ✅ Set selected user
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },

  // ✅ Send a message
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    if (!selectedUser?._id) {
      toast.error("No user selected");
      return;
    }

    try {
      const res = await axiosInstant.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("❌ Error in sendMessage:", error);
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  // ✅ Subscribe to real-time messages
  subscribeToMessages: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;

    if (!selectedUser || !socket) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      
      set({ messages: [...get().messages, newMessage] });
    });
  },

  // ✅ Unsubscribe from messages
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },
}));
