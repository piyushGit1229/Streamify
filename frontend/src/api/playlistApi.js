import { axiosInstance } from "./axiosInstance";

export const createPlaylist = (data) =>
  axiosInstance.post(`/playlists`, data);

export const getMyPlaylists = () =>
  axiosInstance.get(`/playlists/my`);

export const getPlaylist = (playlistId) =>
  axiosInstance.get(`/playlists/${playlistId}`);

export const addVideoToPlaylist = (playlistId, videoId) =>
  axiosInstance.post(`/playlists/${playlistId}/add/${videoId}`);

export const removeVideoFromPlaylist = (playlistId, videoId) =>
  axiosInstance.delete(`/playlists/${playlistId}/remove/${videoId}`);

export const deletePlaylist = (playlistId) =>
  axiosInstance.delete(`/playlists/${playlistId}`);
