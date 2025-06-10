const multer = require("multer");
const {
  storage,
  cityStorage,
  categoryStorage,
} = require("../config/cloudinary");

const uploadBusinessPhotos = multer({ storage });
const uploadCityImage = multer({ storage: cityStorage });
const uploadCategoryIcon = multer({ storage: categoryStorage });

module.exports = {
  uploadBusinessPhotos,
  uploadCityImage,
  uploadCategoryIcon
};
