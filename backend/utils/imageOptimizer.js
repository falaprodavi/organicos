const sharp = require("sharp");
const fs = require("fs");

const optimizeImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize(800) // largura máxima de 800px
      .toFormat("webp", { quality: 80 })
      .toFile(outputPath);

    console.log(`✅ Imagem otimizada: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Erro ao otimizar imagem: ${error.message}`);
    // Se falhar, copia a original
    fs.copyFileSync(inputPath, outputPath);
    console.log(`⚠️ Imagem original copiada: ${outputPath}`);
  }
};

module.exports = { optimizeImage };
