import axios from "axios";

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
  const response = await axios.post(`/api/lunches/${id}/join`);
  return response.data;
};