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
      const accessToken = "fakeAccessToken";
      const refreshToken = "fakeRefreshToken";
      resolve({ data: { accessToken, refreshToken, userId: user.username } });
    } else {
      reject(new Error("Неверные логин или пароль"));
    }
  });
};
