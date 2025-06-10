const express = require("express");
const router = express.Router();
const neighborhoods = require("../controllers/neighborhoods");
const { protect, authorize } = require("../middleware/auth");

// Listar todos os bairros
router.get("/", neighborhoods.getNeighborhoods);

// Listar bairro por ID
router.get("/id/:id", neighborhoods.getNeighborhoodById);

// Listar bairro por slug
router.get("/slug/:slug", neighborhoods.getNeighborhoodBySlug);

// Listar bairros por cidade
router.get("/city/:cityId", neighborhoods.getNeighborhoodsByCity);

// Criar bairro (protegido)
router.post("/", protect, authorize("admin"), neighborhoods.createNeighborhood);

// Atualizar bairro (protegido)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  neighborhoods.updateNeighborhood
);

// Deletar bairro (protegido)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  neighborhoods.deleteNeighborhood
);

module.exports = router;
