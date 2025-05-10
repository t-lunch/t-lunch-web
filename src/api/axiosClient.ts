import axios, { AxiosRequestConfig } from "axios";
import { store } from "../store/store";
import { setCredentials, logout } from "../store/slices/authSlice";
import { API_URL } from "../config"; 

interface StoredToken {
  token: string;
  expiresAt: number;
}

const TOKEN_KEY = "accessToken";

export interface RegisterData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  telegram?: string;
  office?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

let accessToken: string | null = null;

const initStoredToken = () => {
  const str = localStorage.getItem(TOKEN_KEY);
  if (!str) return;
  try {
    const data = JSON.parse(str) as StoredToken;
    if (Date.now() < data.expiresAt) accessToken = data.token;
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    localStorage.removeItem(TOKEN_KEY);
  }
};
initStoredToken();

const storeToken = (token: string, duration: number) => {
  const payload: StoredToken = { token, expiresAt: Date.now() + duration };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(payload));
};

const api = axios.create({
  baseURL: API_URL,    
  withCredentials: true,
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;

api.interceptors.response.use(
  r => r,
  async err => {
    const original = err.config;
    if (
      err.response?.status === 401 &&
      !original._retry &&
      !isRefreshing
    ) {
      original._retry = true;
      isRefreshing = true;
      try {
        const resp = await axios.post(
          `${API_URL()}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken: string = resp.data.accessToken;
        accessToken = newToken;
        storeToken(newToken, 2 * 60 * 60 * 1000);
        store.dispatch(setCredentials({
          accessToken: newToken,
          userId: store.getState().auth.userId!,
          userName: store.getState().auth.userName!
        }));
        if (original.headers) {
          original.headers.Authorization = `Bearer ${newToken}`;
        }
        return axios.request(original);
      } catch {
        store.dispatch(logout());
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
