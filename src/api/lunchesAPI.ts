import axios from "axios";

export const getLunches = async () => {
  const response = await axios.get("/api/lunches");
  return response.data;
};