import api from "../axios";

const CityService = {
  getAll: async () => {
    try {
      const response = await api.get("/cities");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPopularCities: async () => {
    try {
      const response = await api.get("/cities/popular");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getActiveCities: async () => {
    try {
      const response = await api.get("/cities?active=true");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/cities/id/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBySlug: async (slug) => {
    try {
      const response = await api.get(`/cities/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (formData) => {
    try {
      const response = await api.post("/cities", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, formData) => {
    try {
      const response = await api.put(`/cities/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/cities/${id}`);
      return response.data;
    } catch (error) {
      // Adiciona mais detalhes ao erro
      const enhancedError = new Error(
        error.response?.data?.message || "Falha ao excluir cidade"
      );
      enhancedError.status = error.response?.status;
      enhancedError.details = error.response?.data;
      throw enhancedError;
    }
  },
};

export default CityService;
