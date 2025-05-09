import api from "./axiosClient";

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  userId: string;
  userName: string;
}

export const login = (data: LoginData): Promise<LoginResponse> =>
  api.post("/auth/login", data).then(r => r.data);

export interface RegisterData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  telegram?: string;
  office?: string;
}

export const register = (data: RegisterData): Promise<{ message: string }> =>
  api.post("/auth/register", data).then(r => r.data);
