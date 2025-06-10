import api from "./axios";

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  register: async (name, email, phone, password) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
      });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data.data; // ← Acesse a propriedade data aninhada
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
      return null;
    }
  },

  isAdmin: async () => {
    try {
      const user = await AuthService.getCurrentUser();
      return user?.role === "admin";
    } catch (error) {
      return false;
    }
  },
};

export default AuthService;
