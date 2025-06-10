const mongoose = require("mongoose");
const slugify = require("slugify");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String }, // Caminho do arquivo da imagem
  imagePublicId: { type: String }, // Opcional, se usar serviços como Cloudinary
});

// Sempre gera slug antes de salvar
CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
