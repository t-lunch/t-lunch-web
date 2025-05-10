import api from "./axiosClient";
import { store } from "../store/store";
import { Lunch } from "../types/lunchesTypes";

export const getLunches = async (): Promise<Lunch[]> => {
  const response = await api.get<Lunch[]>("/api/lunches");
  return response.data;
};

export const getLunchById = async (id: string): Promise<Lunch> => {
  const response = await api.get<Lunch>(`/api/lunches/${id}`);
  return response.data;
};

export const createLunch = async (
  data: Omit<Lunch, "id" | "participants" | "participantsList">
): Promise<Lunch> => {
  const response = await api.post<Lunch>("/api/lunches", data);
  return response.data;
};

export const joinLunch = async (id: string): Promise<Lunch> => {
  const userId = store.getState().auth.userId!;
  const creatorName = store.getState().auth.userName!;

  const response = await api.post<Lunch>(`/api/lunches/${id}/join`, {
    userId,
    creatorName,
  });
  return response.data;
};

export const leaveLunch = async (id: string): Promise<Lunch> => {
  const userId = store.getState().auth.userId!;

  const response = await api.post<Lunch>(`/api/lunches/${id}/leave`, { userId });
  return response.data;
};
