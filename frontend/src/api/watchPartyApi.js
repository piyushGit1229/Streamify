import { axiosInstance } from "./axiosInstance";

// CREATE ROOM
export const createWatchParty = async (data) => {
  const response = await axiosInstance.post('/watch-party/create', data);
  return response.data;
};

// JOIN ROOM
export const joinWatchParty = async (data) => {
  const response = await axiosInstance.post('/watch-party/join', data);
  return response.data;
};

// GET ROOM DETAILS
export const getWatchPartyRoom = async (roomCode) => {
  const response = await axiosInstance.get(`/watch-party/${roomCode}`);
  return response.data;
};
