import axios from "axios";

const api = axios.create({ 
  baseURL: "http://localhost:5000/api",
  withCredentials: true, 
 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 

api.interceptors.response.use(
  response => response,
  async error => {  
    if (error.response && error.response.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post("http://localhost:5000/api/auth/refresh", { refreshToken });
          const newToken = response.data.token;
          localStorage.setItem("accessToken", newToken);
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axios.request(error.config);
        } catch (error) {
          console.log("refresh token error");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }

      }
    }
    return Promise.reject(error);
  }
);

export const register = (data: any) => api.post("/auth/register", data);
export const login = (data: any) => api.post("/auth/login", data);