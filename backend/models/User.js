const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Por favor adicione um nome"],
  },
  email: {
    type: String,
    required: [true, "Por favor adicione um email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Por favor adicione um email válido",
    ],
  },
  password: {
    type: String,
    required: [true, "Por favor adicione uma senha"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["owner", "admin"],
    default: "owner",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  phone: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  updatedAt: {
    type: Date,
  },
});

// Adicione esta referência ao schema do User
favorites: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
  },
];

// Criptografar senha antes de salvar
UserSchema.pre("save", async function (next) {
  this.updatedAt = new Date();
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema);
