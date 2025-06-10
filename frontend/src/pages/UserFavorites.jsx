import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteService from "../api/services/favorites";
import AuthService from "../api/auth";
import Card from "../components/Card"; // Componente para exibir cada estabelecimento

const UserFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Verificar se o usuário está logado
        const user = await AuthService.getCurrentUser();
        if (!user) {
          navigate("/login", { state: { from: "/favorites" } });
          return;
        }

        const response = await FavoriteService.getUserFavorites();
        setFavorites(response.data);
      } catch (err) {
        setError("Erro ao carregar favoritos. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await FavoriteService.removeFavorite(favoriteId);
      setFavorites(favorites.filter((fav) => fav._id !== favoriteId));
    } catch (err) {
      setError("Erro ao remover favorito. Tente novamente.");
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <div className="user-favorites">
      <h1>Meus Favoritos</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Sair
      </button>

      {favorites.length === 0 ? (
        <p>Você ainda não adicionou nenhum estabelecimento aos favoritos.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((favorite) => (
            <div key={favorite._id} className="favorite-item">
              <Card business={favorite.business} />
              <button
                onClick={() => handleRemoveFavorite(favorite._id)}
                className="remove-favorite"
              >
                Remover dos favoritos
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFavorites;
