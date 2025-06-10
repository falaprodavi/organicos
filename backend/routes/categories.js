const express = require("express");
const router = express.Router();
const categories = require("../controllers/categories");
const { uploadCategoryIcon } = require("../middleware/upload");
const { protect, authorize } = require("../middleware/auth");

// Listar todas
router.get("/", categories.getAllCategories);

// Listar por ID
router.get("/id/:id", categories.getCategoryById);

// Listar por slug
router.get("/slug/:slug", categories.getCategoryBySlug);

// Criar categoria (protegido)
router.post(
  "/",
  protect,
  authorize("admin"), // remova isso se quiser permitir para todos os logados
  uploadCategoryIcon.single("icon"),
  categories.createCategory
);

// Atualizar categoria (protegido)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadCategoryIcon.single("icon"),
  categories.updateCategory
);

// Deletar categoria (protegido)
router.delete("/:id", protect, authorize("admin"), categories.deleteCategory);

module.exports = router;
