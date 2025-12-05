import { axiosInstance } from "./axiosInstance";

export const getComments = (videoId) =>
  axiosInstance.get(`/comments/${videoId}`);

export const createComment = (videoId, content) =>
  axiosInstance.post(`/comments/${videoId}`, { content });

export const replyComment = (commentId, videoId, content) =>
  axiosInstance.post(`/comments/reply/${commentId}`, { videoId, content });

export const deleteComment = (commentId) =>
  axiosInstance.delete(`/comments/${commentId}`);

export const getReplies = (commentId) =>
  axiosInstance.get(`/comments/replies/${commentId}`);
