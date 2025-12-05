import { create } from "zustand";
import { loginApi, signupApi, getProfileApi, logoutApi } from "../api/authApi";
import toast from "react-hot-toast";
import { useLibraryStore } from "./libraryStore";

export const useAuthStore = create((set) => ({

  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  loading: false,

  // Called on refresh
  initializeUser: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return; // no token → no auto login

    try {
      const res = await getProfileApi();
      set({ user: res.data.user, accessToken: token });
      // Fetch library data after user is set
      useLibraryStore.getState().fetchLibraryData();
    } catch {
      set({ user: null, accessToken: null });
      localStorage.removeItem("accessToken");
    }
  },

  // LOGIN
  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const res = await loginApi({ email, password });

      // Save token
      localStorage.setItem("accessToken", res.data.accessToken);

      set({
        user: res.data.user,
        accessToken: res.data.accessToken,
      });

      // Fetch library data after login
      useLibraryStore.getState().fetchLibraryData();

      toast.success("Logged in");
      return true;

    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
      return false;

    } finally {
      set({ loading: false });
    }
  },

  // SIGNUP
  signup: async (data) => {
    set({ loading: true });
    try {
      const res = await signupApi(data);

      // Save token
      localStorage.setItem("accessToken", res.data.accessToken);

      set({
        user: res.data.user,
        accessToken: res.data.accessToken,
      });

      // Fetch library data after signup
      useLibraryStore.getState().fetchLibraryData();

      toast.success("Account created");
      return true;

    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
      return false;

    } finally {
      set({ loading: false });
    }
  },

  // LOGOUT
  logout: async () => {
    set({ loading: true });
    try {
      await logoutApi();

      // Clear local storage
      localStorage.removeItem("accessToken");

      // Clear state
      set({ user: null, accessToken: null });

      toast.success("Logged out successfully");

    } catch (err) {
      toast.error(err?.response?.data?.message || "Logout failed");
    } finally {
      set({ loading: false });
    }
  },

}));
