// controllers/favorites.js
const Favorite = require("../models/Favorite");
const Business = require("../models/Business");

// @desc    Adicionar estabelecimento aos favoritos
// @route   POST /api/v1/favorites
// @access  Private (qualquer usuário autenticado)
exports.createFavorite = async (req, res, next) => {
  try {
    const { businessId } = req.body;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Por favor, informe o ID do estabelecimento",
      });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Estabelecimento não encontrado",
      });
    }

    // Verifica se já está favoritado
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      business: businessId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Este estabelecimento já está nos seus favoritos",
      });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      business: businessId,
    });

    res.status(201).json({
      success: true,
      data: favorite,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Erro ao adicionar aos favoritos",
    });
  }
};

// @desc    Listar favoritos do usuário
// @route   GET /api/v1/favorites
// @access  Private (apenas do próprio usuário)
exports.getUserFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate({
      path: "business",
      select: "name description photos address category",
    });

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar favoritos",
    });
  }
};

// @desc    Remover dos favoritos
// @route   DELETE /api/v1/favorites/:id
// @access  Private (apenas do próprio usuário)
exports.deleteFavorite = async (req, res, next) => {
  try {
    const filter = {
      _id: req.params.id,
    };

    // Se não for admin, só pode deletar seus próprios favoritos
    if (req.user.role !== "admin") {
      filter.user = req.user.id;
    }

    const favorite = await Favorite.findOneAndDelete(filter);

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorito não encontrado ou você não tem permissão",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Erro ao remover dos favoritos",
    });
  }
};
