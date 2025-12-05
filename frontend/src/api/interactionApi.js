import { axiosInstance } from "./axiosInstance";

export const likeVideo = (videoId) =>
  axiosInstance.post(`/interactions/like/${videoId}`);

export const dislikeVideo = (videoId) =>
  axiosInstance.post(`/interactions/dislike/${videoId}`);

export const getMyLikes = () => axiosInstance.get(`/interactions/liked`);
export const getMyDislikes = () => axiosInstance.get(`/interactions/disliked`);
