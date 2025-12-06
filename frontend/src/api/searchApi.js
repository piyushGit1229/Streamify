import { axiosInstance } from "./axiosInstance";

export const searchVideos = async (query) => {
  return axiosInstance.get(`/videos/search?q=${query}`);
};
