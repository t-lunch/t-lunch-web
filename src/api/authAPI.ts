import axios from "axios";

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
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios.request(error.config);
        } catch (refreshError) {
          console.log("refresh token error");
          accessToken = null;
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
      accessToken = newAccessToken;
      resolve({ data: { accessToken, userId: user.username } });
    } else {
      reject(new Error("Неверные логин или пароль"));
    }
  });
};
