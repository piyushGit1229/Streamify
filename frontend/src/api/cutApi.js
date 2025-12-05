import { axiosInstance } from "./axiosInstance";

export const createCut = (data) =>
  axiosInstance.post("/cuts", data);

export const getMyCuts = () =>
  axiosInstance.get("/cuts/my");

export const deleteCut = (id) =>
  axiosInstance.delete(`/cuts/${id}`);
