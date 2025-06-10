import api from "../axios";

const NeighborhoodService = {
  getAll: async () => {
    try {
      const response = await api.get("/neighborhoods");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/neighborhoods/id/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBySlug: async (slug) => {
    try {
      const response = await api.get(`/neighborhoods/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getByCity: async (cityId) => {
    try {
      const response = await api.get(`/neighborhoods/city/${cityId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (formData) => {
    try {
      console.log("Enviando dados:", formData); // Debug
      const response = await api.post("/neighborhoods", formData, {
        headers: {
          "Content-Type": "application/json", // Garanta que está usando JSON
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro na requisição:", {
        config: error.config,
        response: error.response,
      });
      throw error;
    }
  },

  update: async (id, formData) => {
    try {
      const response = await api.put(`/neighborhoods/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/neighborhoods/${id}`);
      return response.data;
    } catch (error) {
      const enhancedError = new Error(
        error.response?.data?.message || "Falha ao excluir bairro"
      );
      enhancedError.status = error.response?.status;
      enhancedError.details = error.response?.data;
      throw enhancedError;
    }
  },
};

export default NeighborhoodService;
