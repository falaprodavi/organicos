const express = require("express");
const router = express.Router();
const subCategories = require("../controllers/subCategories");
const { uploadSubCategoryIcon } = require("../utils/fileUpload");
const { protect, authorize } = require("../middleware/auth");

// Rotas públicas
router.get("/", subCategories.getSubCategories);
router.get("/id/:id", subCategories.getSubCategoryById);
router.get("/slug/:slug", subCategories.getSubCategoryBySlug);
router.get("/category/:categorySlug", subCategories.getSubCategoriesByCategory);
router.get('/by-category-id/:categoryId', subCategories.getSubCategoriesByCategoryId);

// Rotas protegidas (admin)
router.post(
  "/",
  protect,
  authorize("admin"),
  uploadSubCategoryIcon.single("icon"),
  subCategories.createSubCategory
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadSubCategoryIcon.single("icon"),
  subCategories.updateSubCategory
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  subCategories.deleteSubCategory
);

// Rota para deletar permanentemente (opcional)
router.delete(
  "/hard/:id",
  protect,
  authorize("admin"),
  subCategories.hardDeleteSubCategory
);

module.exports = router;
