import api from "../axios";

const SubCategoryService = {
  getAll: async () => {
    try {
      const response = await api.get("/subCategories");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/subCategories/id/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBySlug: async (slug) => {
    try {
      const response = await api.get(`/subCategories/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getByCategory: async (categorySlug) => {
    try {
      const response = await api.get(`/subCategories/category/${categorySlug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getByCategoryId: async (categoryId) => {
    try {
      const response = await api.get(
        `/subcategories/by-category-id/${categoryId}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar subcategorias:", error);
      // Retorna array vazio em caso de erro para não quebrar a UI
      return [];
    }
  },

  create: async (formData) => {
    try {
      const response = await api.post("/subCategories", formData, {
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
      const response = await api.put(`/subCategories/${id}`, formData, {
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
      const response = await api.delete(`/subCategories/${id}`);
      return response.data;
    } catch (error) {
      const enhancedError = new Error(
        error.response?.data?.message || "Falha ao excluir subcategoria"
      );
      enhancedError.status = error.response?.status;
      enhancedError.details = error.response?.data;
      throw enhancedError;
    }
  },
};

export default SubCategoryService;
