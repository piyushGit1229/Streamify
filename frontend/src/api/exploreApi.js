import { axiosInstance } from "./axiosInstance";

export const getExploreData = () => axiosInstance.get("/explore");
