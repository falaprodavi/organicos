import api from "../axios";

const CategoryService = {
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/categories/id/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBySlug: async (slug) => {
    try {
      const response = await api.get(`/categories/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (formData) => {
    try {
      const response = await api.post("/categories", formData, {
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
      const response = await api.put(`/categories/${id}`, formData, {
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
      const response = await api.delete(`/categories/${id}`);
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
export default CategoryService;
