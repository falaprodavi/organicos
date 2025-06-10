import api from "./api";

const FavoriteService = {
  async addFavorite(businessId) {
    try {
      const response = await api.post("/favorites", { businessId });
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
      throw error;
    }
  },

  async removeFavorite(favoriteId) {
    try {
      const response = await api.delete(`/favorites/${favoriteId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      throw error;
    }
  },

  async getUserFavorites() {
    try {
      const response = await api.get("/favorites");
      return {
        success: true,
        data: response.data?.data || [],
      };
    } catch (error) {
      if (error.response?.status === 401) {
        return { success: false, data: [], isUnauthorized: true };
      }
      return { success: false, data: [] };
    }
  },

  async checkIsFavorite(businessId) {
    try {
      const result = await this.getUserFavorites();
      return result.data.some((fav) => fav?.business?._id === businessId);
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
      return false;
    }
  },

  async toggleFavorite(businessId, isCurrentlyFavorite, favoriteId) {
    try {
      if (isCurrentlyFavorite) {
        if (!favoriteId) {
          throw new Error("ID do favorito não fornecido");
        }
        return await this.removeFavorite(favoriteId);
      } else {
        return await this.addFavorite(businessId);
      }
    } catch (error) {
      console.error("Erro no toggleFavorite:", error);
      throw error;
    }
  },
};

export default FavoriteService;
