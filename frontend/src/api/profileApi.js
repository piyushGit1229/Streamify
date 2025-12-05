import { axiosInstance } from "./axiosInstance";

export const getProfile = () =>
  axiosInstance.get("/profile/me");

export const updateProfile = (data) =>
  axiosInstance.put("/profile/update", data);

export const updateAvatar = (base64) =>
  axiosInstance.put("/profile/avatar", { avatar: base64 });

export const updateBanner = (base64) =>
  axiosInstance.put("/profile/banner", { banner: base64 });
