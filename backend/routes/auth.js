const express = require("express");
const {
  register,
  login,
  updateUser,
  deleteUser,
  getUsers,
  getCurrentUser, // Você precisará criar este controller
} = require("../controllers/auth");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Rota para usuário atual (qualquer usuário autenticado)
router
  .route("/me")
  .get(protect, getCurrentUser) // Adicione esta linha
  .put(protect, updateUser)
  .delete(protect, (req, res) => {
    res.status(403).json({
      success: false,
      message: "Use a rota /api/auth/:id (apenas para administradores)",
    });
  });

// Nova rota para admin deletar usuários
router.delete("/:id", protect, authorize("admin"), deleteUser);

router.get("/users", protect, authorize("admin"), getUsers);

module.exports = router;
