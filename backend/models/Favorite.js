// models/Favorite.js
const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Impede favoritos duplicados
FavoriteSchema.index({ user: 1, business: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", FavoriteSchema);