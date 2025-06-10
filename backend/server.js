require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

const { protect, authorize } = require("./middleware/auth");

// Middleware
// app.use(cors());

app.use(
  cors({
    origin: [
      "https://app-negocios-locais.vercel.app",
      "https://www.ovaleonline.com.br",
      "https://ovaleonline.com.br",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Servir arquivos estáticos (para as imagens)
app.use(express.static(path.join(__dirname, "public")));

app.use((err, req, res, next) => {
  // Erros de duplicidade
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `Já existe um registro com este ${field}`,
      field: field,
    });
  }

  // Outros erros
  res.status(500).json({
    success: false,
    message: "Erro no servidor",
  });
});

// Rotas
app.use("/api/auth", require("./routes/auth"));

app.use("/api/cities", require("./routes/cities"));
app.use("/api/neighborhoods", require("./routes/neighborhoods"));

app.use("/api/categories", require("./routes/categories"));
app.use("/api/subCategories", require("./routes/subCategories"));

app.use("/api/favorites", require("./routes/favorites"));

app.use("/api/businesses", require("./routes/businesses"));

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Rota básica de teste
app.get("/", (req, res) => {
  res.send("API de Negócios Locais está funcionando!!!");
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
