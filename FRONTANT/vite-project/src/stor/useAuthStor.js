import { create } from 'zustand';
import { axiosInstant } from '../lib/axios.js';
import toast from 'react-hot-toast';
import io from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningIn: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstant.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstant.post("/auth/signup", data);
      toast.success("Your account was created successfully");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in signup:", error);
      toast.error(error?.response?.data?.message || "Signup failed. Try again.");
      set({ authUser: null });
    } finally {
      set({ isSigningIn: false });
    }
  },

  login: async ({ email, password }) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstant.post("/auth/login", { email, password });
      set({ authUser: res.data });
      toast.success("Login successfully");
    } catch (error) {
      console.log("Error in login:", error);
      toast.error(error?.response?.data?.message || "Login failed. Try again.");
      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstant.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successfully");
      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout:", error);
      toast.error(error?.response?.data?.message || "Logout failed. Try again.");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstant.put("/auth/update-profilepic", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in updateProfile:", error);
      toast.error("Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser._id
      }
    });

    newSocket.connect();

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      console.log("✅ Received online users:", userIds);
      set({ onlineUsers: userIds });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
      console.log("Socket disconnected");
    }
  },
}));
