import { axiosInstance } from "./axiosInstance";

export const addWatchLater = (videoId) =>
  axiosInstance.post(`/watch-later/${videoId}`);

export const removeWatchLater = (videoId) =>
  axiosInstance.delete(`/watch-later/${videoId}`);

export const listWatchLater = () =>
  axiosInstance.get(`/watch-later`);
