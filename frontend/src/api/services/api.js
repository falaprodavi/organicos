import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Só redireciona para login se for uma requisição específica
    if (error.config.url !== "/auth/me" && error.response?.status === 401) {
      localStorage.removeItem("token");
      // Não redireciona automaticamente aqui - deixe o componente tratar
    }
    return Promise.reject(error);
  }
);

export default api;
