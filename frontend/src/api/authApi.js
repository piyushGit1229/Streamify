import { axiosInstance } from "./axiosInstance";

export const loginApi = (data) => axiosInstance.post("/auth/login", data);

export const signupApi = (data) => axiosInstance.post("/auth/signup", data);

export const getProfileApi = () => axiosInstance.get("/auth/me");

export const logoutApi = () => axiosInstance.post("/auth/logout");