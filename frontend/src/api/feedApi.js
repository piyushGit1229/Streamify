import { axiosInstance } from "./axiosInstance";

export const getHomeFeed = () => axiosInstance.get("/feed/home");
