const Business = require("../models/Business");
const express = require("express");
const router = express.Router();
const {
  createBusiness,
  getBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness,
  getLatestBusinesses,
  searchBusinesses,
  getBusinessBySlug,
  getDashboardStats,
  getRecentBusinesses,
  getBusinessesByDate,
  deleteBusinessPhoto, // Adicione esta nova importação
} = require("../controllers/businessController");

const { protect, authorize } = require("../middleware/auth");
const { uploadBusinessPhotos } = require("../middleware/upload");

// GET /api/businesses/search
router.get("/search", searchBusinesses);
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/recent-businesses", getRecentBusinesses);
router.get("/by-date", getBusinessesByDate);
router.get("/latest", getLatestBusinesses);
router.get("/slug/:slug", getBusinessBySlug);

// Nova rota para deletar fotos específicas
router.delete(
  "/:id/photos",
  protect,
  authorize("admin", "owner"),
  deleteBusinessPhoto
);

router
  .route("/")
  .get(getBusinesses)
  .post(
    protect,
    authorize("admin", "owner"),
    uploadBusinessPhotos.array("photos", 10),
    createBusiness
  );

router
  .route("/:id")
  .get(getBusiness)
  .put(
    protect,
    authorize("admin", "owner"),
    uploadBusinessPhotos.array("photos", 10),
    updateBusiness
  )
  .delete(protect, authorize("admin", "owner"), deleteBusiness);

module.exports = router;
