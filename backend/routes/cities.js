const express = require("express");
const router = express.Router();
const cities = require("../controllers/cities");
//const { uploadCityImage } = require("../utils/fileUpload");
const { protect, authorize } = require("../middleware/auth");
const { uploadCityImage } = require('../middleware/upload');


// Listar todas
router.get("/", cities.getAllCities);

router.get("/popular", cities.getPopularCities);

// Listar por ID
router.get("/id/:id", cities.getCityById);

// Listar por slug
router.get("/slug/:slug", cities.getCityBySlug);

// Criar categoria (protegido)
router.post(
  "/",
  protect,
  authorize("admin"), // remova isso se quiser permitir para todos os logados
  uploadCityImage.single("image"),
  cities.createCity
);

// Atualizar categoria (protegido)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadCityImage.single("image"),
  cities.updateCity
);

// Deletar categoria (protegido)
router.delete("/:id", protect, authorize("admin"), cities.deleteCity);


module.exports = router;
