import  { axiosInstance } from "./axiosInstance";

export const getLikedVideos = () => axiosInstance.get("/interactions/liked");

