const mongoose = require("mongoose");
const slugify = require("slugify");

const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome é obrigatório"],
      trim: true,
      maxlength: [50, "Máximo de 50 caracteres"],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "A categoria é obrigatória"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    collation: { locale: "pt", strength: 2 }, // Busca case-insensitive
    timestamps: true,
  }
);

// Índice para evitar duplicatas (nome + categoria)
SubCategorySchema.index(
  { name: 1, category: 1 },
  { unique: true, collation: { locale: "pt", strength: 1 } }
);

// Gera o slug automaticamente antes de salvar
SubCategorySchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, { 
    lower: true, 
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
  next();
});

module.exports = mongoose.model("SubCategory", SubCategorySchema);