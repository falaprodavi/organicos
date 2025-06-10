const path = require("path");
const { optimizeImage } = require("../utils/imageOptimizer");

const optimizeUploadedImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  for (let file of req.files) {
    const inputPath = file.path;

    // Ex.: business-17169112345.jpg -> business-17169112345.webp
    const outputPath = inputPath.replace(/\.[^/.]+$/, ".webp");

    await optimizeImage(inputPath, outputPath);

    // Guarda o novo caminho otimizado no objeto file
    file.optimizedPath = outputPath;
  }

  next();
};

module.exports = { optimizeUploadedImages };
