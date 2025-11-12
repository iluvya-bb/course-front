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

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await api.get("/auth/me");
      return response.data.data;
    } catch (error) {
      console.error("Failed to get current user:", error);
      // If token is invalid, remove it
      localStorage.removeItem("token");
      return null;
    }
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
