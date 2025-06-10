import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteService from "../api/services/favorites";
import AuthService from "../api/auth";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const FavoriteButton = ({ businessId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const user = await AuthService.getCurrentUser();
        setIsAuthenticated(!!user);

        if (user) {
          const { data } = await FavoriteService.getUserFavorites();
          const favorite = data.find(
            (fav) => fav?.business?._id === businessId
          );
          if (favorite) {
            setIsFavorite(true);
            setFavoriteId(favorite._id);
          }
        }
      } catch (error) {
        console.error("Verificação de favoritos falhou:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthAndFavorites();
  }, [businessId]);

  const handleToggleFavorite = async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (!isAuthenticated) {
        navigate("/login", {
          state: {
            from: window.location.pathname,
            message: "Por favor, faça login para gerenciar seus favoritos",
          },
        });
        return;
      }

      if (isFavorite) {
        await FavoriteService.removeFavorite(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        const response = await FavoriteService.addFavorite(businessId);
        setIsFavorite(true);
        setFavoriteId(response.data._id);
      }
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login", {
          state: {
            from: window.location.pathname,
            message: "Sessão expirada. Por favor, faça login novamente",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      aria-label={
        isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
      }
      className="relative"
    >
      {isFavorite ? (
        <FaHeart className="text-red-500 text-xl" />
      ) : (
        <FaRegHeart className="text-gray-500 text-xl hover:text-red-500 transition-colors" />
      )}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></span>
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
