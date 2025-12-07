import { axiosInstance } from "./axiosInstance";

export const getVideo = (id, incViews = false) =>
  axiosInstance.get(`/videos/${id}${incViews ? '?inc=true' : ''}`);

// export const getRelatedVideos = (id) =>
//   axiosInstance.get(`/videos/${id}/related`);

export const searchVideos = (query, page = 1, limit = 10) =>
  axiosInstance.get(`/videos/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);

export const uploadVideo = (formData) =>
  axiosInstance.post("/videos/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
