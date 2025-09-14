
import api from "./api";

export const getExercises = async (lessonId) => {
  const response = await api.get(`/lessons/${lessonId}/exercises`);
  return response.data;
};

export const getExercise = async (id) => {
  const response = await api.get(`/exercises/${id}`);
  return response.data;
};

export const createExercise = async (exercise) => {
  const response = await api.post("/exercises", exercise);
  return response.data;
};

export const updateExercise = async (id, exercise) => {
  const response = await api.put(`/exercises/${id}`, exercise);
  return response.data;
};

export const deleteExercise = async (id) => {
  const response = await api.delete(`/exercises/${id}`);
  return response.data;
};
