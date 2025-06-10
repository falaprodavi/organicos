const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function extractPublicIdFromUrl(url) {
  const matches = url.match(/upload\/(?:v\d+\/)?([^\.]+)/);
  return matches ? matches[1] : null;
}

async function deleteImageFromCloudinary(url) {
  const publicId = extractPublicIdFromUrl(url);
  if (!publicId) {
    throw new Error("Não foi possível extrair o publicId da URL");
  }
  return cloudinary.uploader.destroy(publicId);
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "businesses", // pasta no Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "svg"],
  },
});

const cityStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cities",
    allowed_formats: ["jpg", "png", "jpeg", "svg"],
  },
});

const categoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "categories",
    allowed_formats: ["jpg", "png", "jpeg", "svg"],
  },
});

module.exports = { cloudinary, storage, cityStorage, categoryStorage };
