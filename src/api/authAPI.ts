import axios from "axios";
import { store } from "../store/store";
import { setCredentials, logout } from "../store/authSlice";
// import 

interface StoredToken {
  token: string;
  expiresAt: number;
}

const TOKEN_KEY = "accessToken";

export const getStoredToken = (): StoredToken | null => {
  const tokenString = localStorage.getItem(TOKEN_KEY);
  if (tokenString) {
    try {
      const tokenData = JSON.parse(tokenString) as StoredToken;
      if (tokenData && tokenData.token && Date.now() < tokenData.expiresAt) {
        return tokenData;
      } else {
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  }
  return null;
}

const storeToken = (token: string, duration: number): void => {
  const tokenData: StoredToken = {
    token,
    expiresAt: Date.now() + duration
  };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
};

let accessToken: string | null = null;
const api = axios.create({ 
  baseURL: "http://localhost:5000/api",
  withCredentials: true, 
 });

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}); 

api.interceptors.response.use(
  response => response,
  async error => {  
    if (error.response && error.response.status === 401) {
        try {
          const response = await axios.post("http://localhost:5000/api/auth/refresh", {}, { withCredentials: true });
          const newAccessToken = response.data.accessToken;
          accessToken = newAccessToken;
          storeToken(newAccessToken, 3600000);
          store.dispatch(setCredentials({ accessToken: newAccessToken, userId: store.getState().auth.userId }));
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios.request(error.config);
        } catch {
          store.dispatch(logout());
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = "/login";
        }

      }
    return Promise.reject(error);
  }
);

// export const register = (data: any) => api.post("/auth/register", data);
// export const login = (data: any) => api.post("/auth/login", data);

export const register = (data: any) => {
  return new Promise((resolve, reject) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((user: any) => user.username === data.username);

    if (existingUser) {
      reject(new Error("Пользователь с таким логином уже существует"));
    } else {
      users.push(data);
      localStorage.setItem('users', JSON.stringify(users));
      resolve({ data: { message : "Регистрация успешна "}});  
    }
  })
}

export const login = (data: any) => {
  return new Promise((resolve, reject) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((user: any) => user.username === data.username && user.password === data.password);
    if (user) {
      // fake tokens
      const newAccessToken = "fakeAccessToken";
      storeToken(newAccessToken, 7200000);
      accessToken = newAccessToken;
      resolve({ data: { accessToken, userId: user.username } });
    } else {
      reject(new Error("Неверные логин или пароль"));
    }
  });
};
