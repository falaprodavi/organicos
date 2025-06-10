const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuração para CATEGORIAS
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/uploads/categories";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      "category-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const cityStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/uploads/cities";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      "cities-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Configuração para SUBCATEGORIAS
const subCategoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/uploads/subcategories";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      "subcategory-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Configuração para ícones de subcategorias
const subCategoryIconStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("public", "uploads", "subcategories"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const uploadSubCategoryIcon = multer({
  storage: subCategoryIconStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|svg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error(
        "Apenas arquivos de imagem são permitidos (jpeg, jpg, png, svg)"
      )
    );
  },
});

// Configuração para ESTABELECIMENTOS (BUSINESS)
const businessStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/uploads/businesses";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      "business-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Filtro comum para todos (aceita apenas imagens)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".jpg", ".jpeg", ".png", ".svg"];
  const ext = path.extname(file.originalname).toLowerCase();
  allowedTypes.includes(ext)
    ? cb(null, true)
    : cb(new Error("Apenas imagens são permitidas (JPEG, PNG, SVG)"), false);
};

// Middlewares exportados
module.exports = {
  uploadCategoryIcon: multer({
    storage: categoryStorage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  }),

  uploadCityImage: multer({
    storage: cityStorage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  }),

  uploadSubCategoryIcon: multer({
    storage: subCategoryStorage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  }),

  uploadBusinessPhotos: multer({
    storage: businessStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB para fotos de estabelecimentos
  }),

  uploadSubCategoryIcon,

  uploadBusinessCreate: multer({
    storage: businessStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }).array("photos", 10), // Aceita até 10 fotos
};
