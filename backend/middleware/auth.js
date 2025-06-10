// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware para proteger rotas
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Acesso não autorizado - Token não fornecido",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "O usuário deste token não existe mais",
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Acesso não autorizado - Token inválido",
    });
  }
};

// Middleware para autorizar por roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acesso negado: requer permissão de ${roles}`,
      });
    }
    next();
  };
};