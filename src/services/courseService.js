import api from "./api";

export const getCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};