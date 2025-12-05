import { create } from "zustand";
import {
  getProfile,
  updateProfile,
  updateAvatar,
  updateBanner
} from "../api/profileApi";

export const useProfileStore = create((set) => ({
  user: null,
  loading: true,

  fetchProfile: async () => {
    try {
      const res = await getProfile();
      set({ user: res.data.user, loading: false });
    } catch (err) {
      console.error("FETCH PROFILE ERROR:", err);
      set({ loading: false });
    }
  },

  updateInfo: async (data) => {
    const res = await updateProfile(data);
    set({ user: res.data.user });
  },

  changeAvatar: async (base64) => {
    const res = await updateAvatar(base64);
    set((state) => ({
      user: { ...state.user, avatar: res.data.avatar }
    }));
  },

  changeBanner: async (base64) => {
    const res = await updateBanner(base64);
    set((state) => ({
      user: { ...state.user, channelBanner: res.data.banner }
    }));
  }
}));
