
import api from "./api";

export const getSubscriptions = async () => {
  const response = await api.get("/subscriptions");
  return response.data;
};

export const createSubscription = async (subscription) => {
  const response = await api.post("/subscriptions", subscription);
  return response.data;
};
