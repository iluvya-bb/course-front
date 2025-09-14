import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/users/login", { email, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const register = async (name, email, password) => {
  return await api.post("/users/register", { name, email, password });
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (token) {
    // In a real application, you would decode the token to get user info
    // For this example, we'll just return a mock user object
    return { name: "User" };
  }
  return null;
};

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};
