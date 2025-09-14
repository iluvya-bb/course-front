
import api from "./api";

export const getParameters = async () => {
  const response = await api.get("/parameters");
  return response.data;
};

export const getParameter = async (key) => {
  const response = await api.get(`/parameters/${key}`);
  return response.data;
};

export const createParameter = async (parameter) => {
  const response = await api.post("/parameters", parameter);
  return response.data;
};

export const updateParameter = async (key, parameter) => {
  const response = await api.put(`/parameters/${key}`, parameter);
  return response.data;
};

export const deleteParameter = async (key) => {
  const response = await api.delete(`/parameters/${key}`);
  return response.data;
};
