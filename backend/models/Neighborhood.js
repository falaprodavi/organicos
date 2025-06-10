// models/Neighborhood.js

const mongoose = require("mongoose");

const NeighborhoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
});

// Índice composto único: slug + city
NeighborhoodSchema.index({ slug: 1, city: 1 }, { unique: true });

module.exports = mongoose.model("Neighborhood", NeighborhoodSchema);
