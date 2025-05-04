import axios from "axios";
import { store } from "../store/store"; 

export const getLunches = async () => {
  const response = await axios.get("/api/lunches");
  return response.data;
};

export const getLunchById = async (id: string) => {
  const response = await axios.get(`/api/lunches/${id}`);
  return response.data;
};

export const createLunch = async (data: any) => {
  const response = await axios.post("/api/lunches", data, {
    headers: { "Content-Type": "application/json" }
  });
  return response.data;
};

export const joinLunch = async (id: string) => {
  const userId = store.getState().auth.userId!;
  const creatorName = store.getState().auth.user?.name || "Вы";

  const response = await axios.post(
    `/api/lunches/${id}/join`,
    { userId, creatorName },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export const leaveLunch = async (id: string) => {
  const userId = store.getState().auth.userId!;
  const response = await axios.post(
    `/api/lunches/${id}/leave`,
    { userId },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};
