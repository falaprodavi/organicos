import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token JWT às requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros globais - MODIFICADO
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove o token mas NÃO redireciona automaticamente
      localStorage.removeItem("token");
      console.warn("Sessão expirada ou inválida");
      // Retorna o erro para ser tratado no componente específico
    }
    return Promise.reject(error);
  }
);

export default api;
