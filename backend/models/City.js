const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String }, // Caminho ou URL da imagem
  imagePublicId: { type: String }, // Public ID do Cloudinary para exclusão
});

module.exports = mongoose.model("City", CitySchema);
