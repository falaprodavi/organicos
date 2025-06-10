// routes/favorites.js
const express = require("express");
const router = express.Router();
const {
  createFavorite,
  getUserFavorites,
  deleteFavorite,
  getFavorites, // Novo método se necessário
} = require("../controllers/favorites");
const { protect, authorize } = require("../middleware/auth");

// Rotas para usuários comuns
router.route("/").get(protect, getUserFavorites).post(protect, createFavorite);

// Rotas que podem ter diferentes níveis de acesso
router.route("/:id").delete(protect, deleteFavorite); // Só o dono pode deletar

module.exports = router;
