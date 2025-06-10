const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// @desc    Registrar usuário
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // Criar usuário
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    // Criar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      success: true,
      token,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login usuário
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Verificar usuário
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciais inválidas",
      });
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Credenciais inválidas",
      });
    }

    // Criar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Atualizar usuário
// @route   PUT /api/auth/me
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    // Verificar se o email já está em uso por outro usuário
    if (req.body.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({
          success: false,
          message: "Este email já está em uso por outro usuário",
        });
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Excluir conta de usuário
// @route   DELETE /api/auth/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    // Verifica se o usuário a ser deletado existe
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    // Opção 1: Remoção permanente (descomente se preferir)
    // await User.findByIdAndDelete(req.params.id);

    // Opção 2: Soft delete (comente se usar a opção 1)
    await User.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Listar todos os usuários (apenas admin)
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    // Exclui a senha dos resultados
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
