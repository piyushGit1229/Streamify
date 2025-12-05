import { axiosInstance } from "./axiosInstance";

export const subscribe = (channelId) =>
  axiosInstance.post(`/subscriptions/subscribe/${channelId}`);

export const unsubscribe = (channelId) =>
  axiosInstance.post(`/subscriptions/unsubscribe/${channelId}`);

export const channelPage = (channelId) =>
  axiosInstance.get(`/subscriptions/channel/${channelId}`);


export const getMySubscriptions = () =>
  axiosInstance.get("/subscriptions/my");


export const subscriptionFeed = () => 
  axiosInstance.get(`/subscriptions/feed`);
