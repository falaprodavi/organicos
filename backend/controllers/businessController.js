const City = require("../models/City");
const Neighborhood = require("../models/Neighborhood");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Business = require("../models/Business");
const path = require("path");

// Monta o Gráfico do Dasboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalBusinesses = await Business.countDocuments();
    const totalCities = await City.countDocuments();
    const totalCategories = await Category.countDocuments();

    res.json({
      success: true,
      data: {
        totalBusinesses,
        totalCities,
        totalCategories,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// MOstra os cadastrados recentes
exports.getRecentBusinesses = async (req, res) => {
  console.log("✅ Rota acessada em:", new Date()); // ← Deve aparecer no terminal

  try {
    const businesses = await Business.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("address.city", "name")
      .populate("category", "name")
      .select("name photos createdAt slug");

    res.json({
      success: true,
      data: businesses, // ← Formato padronizado
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Criar um novo estabelecimento
exports.createBusiness = async (req, res) => {
  try {
    const photos = req.files.map((file) => file.path); // Cloudinary URL

    const business = await Business.create({
      ...req.body,
      photos,
      owner: req.user._id,
      category: Array.isArray(req.body.category)
        ? req.body.category
        : [req.body.category],
      subCategory: Array.isArray(req.body.subCategory)
        ? req.body.subCategory
        : [req.body.subCategory],
    });

    res.status(201).json({ success: true, data: business });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Atualizar um estabelecimento
exports.updateBusiness = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      const photos = req.files.map((file) => file.path);

      if (req.body.photosAction === "append") {
        const business = await Business.findById(req.params.id);
        updateData.photos = [...business.photos, ...photos];
      } else {
        updateData.photos = photos;
      }
    } else if (req.body.photosToDelete) {
      // Novo: Lidar com deleção de fotos específicas
      const photosToDelete = JSON.parse(req.body.photosToDelete);
      const business = await Business.findById(req.params.id);
      updateData.photos = business.photos.filter(
        (photo) => !photosToDelete.includes(photo)
      );

      // Opcional: Deletar do Cloudinary
      for (const photoUrl of photosToDelete) {
        await cloudinary.uploader.destroy(extrairPublicIdDaUrl(photoUrl));
      }
    }

    // Garante que categories e subCategories sejam arrays
    if (req.body.category) {
      updateData.category = Array.isArray(req.body.category)
        ? req.body.category
        : [req.body.category];
    }

    if (req.body.subCategory) {
      updateData.subCategory = Array.isArray(req.body.subCategory)
        ? req.body.subCategory
        : [req.body.subCategory];
    }

    const updated = await Business.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Estabelecimento não encontrado",
      });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Listar todos os estabelecimentos
exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate(
      "category subCategory address.city address.neighborhood owner"
    );
    res.json({ success: true, data: businesses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Buscar os últimos estabelecimentos cadastrados
exports.getLatestBusinesses = async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  try {
    const businesses = await Business.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("category subCategory address.city address.neighborhood");
    res.json({ success: true, data: businesses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Buscar um único estabelecimento
exports.getBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate(
      "category subCategory address.city address.neighborhood owner"
    );
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Estabelecimento não encontrado" });
    }
    res.json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Excluir um estabelecimento
exports.deleteBusiness = async (req, res) => {
  try {
    const deleted = await Business.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Estabelecimento não encontrado" });
    }
    res.json({
      success: true,
      message: "Estabelecimento removido com sucesso",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Deleta uma foto específica de um estabelecimento
 * @route   DELETE /api/businesses/:id/photos
 * @access  Private (admin/owner)
 */
exports.deleteBusinessPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { photoUrl } = req.body;

    // Validações
    if (!photoUrl) {
      return res.status(400).json({
        success: false,
        message: "URL da foto é obrigatória",
      });
    }

    // Verifica se o negócio existe
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Estabelecimento não encontrado",
      });
    }

    // Remove a foto do array
    business.photos = business.photos.filter((photo) => photo !== photoUrl);
    await business.save();

    // Remove do Cloudinary (opcional)
    try {
      const publicId = extractPublicIdFromUrl(photoUrl); // Você precisa implementar esta função
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.error("Erro ao deletar do Cloudinary:", cloudinaryError);
      // Não retorna erro, pois a foto já foi removida do banco
    }

    res.status(200).json({
      success: true,
      message: "Foto removida com sucesso",
      data: business.photos,
    });
  } catch (error) {
    console.error("Erro ao deletar foto:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao remover foto",
      error: error.message,
    });
  }
};

// Função auxiliar para extrair public_id da URL do Cloudinary
function extractPublicIdFromUrl(url) {
  const parts = url.split("/");
  const uploadIndex = parts.findIndex((part) => part === "upload");
  return parts
    .slice(uploadIndex + 2)
    .join("/")
    .split(".")[0];
}

// Sistema de Busca - Versão melhorada
exports.searchBusinesses = async (req, res) => {
  try {
    const {
      name,
      city,
      neighborhood,
      category,
      subcategory,
      page = 1,
      perPage = 9,
      random = false,
    } = req.query;

    const filter = {};

    // Filtro por nome
    if (name) filter.name = { $regex: name, $options: "i" };

    // Filtro por cidade
    let cityId;
    if (city) {
      const cityDoc = await City.findOne({ slug: city });
      if (!cityDoc) {
        return res.json({
          success: true,
          data: [],
          message: "Cidade não encontrada",
        });
      }
      cityId = cityDoc._id;
      filter["address.city"] = cityId;
    }

    // Filtro de bairro
    if (neighborhood) {
      const neighborhoodFilter = { slug: neighborhood };
      if (cityId) neighborhoodFilter.city = cityId;

      const neighborhoodDoc = await Neighborhood.findOne(neighborhoodFilter);
      if (!neighborhoodDoc) {
        return res.json({
          success: true,
          data: [],
          message: "Bairro não encontrado nesta cidade",
        });
      }
      filter["address.neighborhood"] = neighborhoodDoc._id;
    }

    // Filtros de categoria e subcategoria - modificado para usar $in
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) filter.category = { $in: [categoryDoc._id] };
    }

    if (subcategory) {
      const subCategoryDoc = await SubCategory.findOne({ slug: subcategory });
      if (subCategoryDoc) filter.subCategory = { $in: [subCategoryDoc._id] };
    }

    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(perPage);
    const skip = (currentPage - 1) * itemsPerPage;

    let query;

    if (random === "true" || random === true) {
      // Abordagem para resultados aleatórios usando aggregate
      query = Business.aggregate([
        { $match: filter },
        { $sample: { size: itemsPerPage } },
        // Agrupa por business e acumula categorias/subcategorias
        {
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            categories: { $addToSet: "$category" },
            subCategories: { $addToSet: "$subCategory" },
          },
        },
        // Reconstroi o documento com arrays de categorias
        {
          $project: {
            ...Object.keys(Business.schema.paths).reduce((acc, key) => {
              acc[key] = `$doc.${key}`;
              return acc;
            }, {}),
            category: "$categories",
            subCategory: "$subCategories",
          },
        },
      ]);
    } else {
      // Abordagem normal com aggregate para evitar duplicatas
      query = Business.aggregate([
        { $match: filter },
        // Agrupa por business e acumula categorias/subcategorias
        {
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            categories: { $addToSet: "$category" },
            subCategories: { $addToSet: "$subCategory" },
          },
        },
        // Reconstroi o documento com arrays de categorias
        {
          $project: {
            ...Object.keys(Business.schema.paths).reduce((acc, key) => {
              acc[key] = `$doc.${key}`;
              return acc;
            }, {}),
            category: "$categories",
            subCategory: "$subCategories",
          },
        },
        { $skip: skip },
        { $limit: itemsPerPage },
      ]);
    }

    // Executa a query e conta os documentos
    const [businesses, totalCount] = await Promise.all([
      query,
      Business.countDocuments(filter),
    ]);

    // Popula as relações
    const populatedBusinesses = await Business.populate(businesses, [
      { path: "category", model: "Category" },
      { path: "subCategory", model: "SubCategory" },
      { path: "address.city", model: "City" },
      { path: "address.neighborhood", model: "Neighborhood" },
      { path: "owner", model: "User" },
    ]);

    // Formatação dos resultados
    const formattedBusinesses = populatedBusinesses.map((business) => ({
      ...business,
      citySlug: business.address?.city?.slug,
      neighborhoodSlug: business.address?.neighborhood?.slug,
      categorySlug: business.category?.map((c) => c?.slug),
      subCategorySlug: business.subCategory?.map((sc) => sc?.slug),
    }));

    res.json({
      success: true,
      data: formattedBusinesses,
      pagination: {
        page: currentPage,
        perPage: itemsPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Erro na busca",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Busca pela Slug
exports.getBusinessBySlug = async (req, res) => {
  try {
    const business = await Business.findOne({ slug: req.params.slug }).populate(
      "category subCategory address.city address.neighborhood owner"
    );

    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Não encontrado" });
    }

    res.json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Pega por data
exports.getBusinessesByDate = async (req, res) => {
  try {
    const businesses = await Business.find({})
      .select("createdAt")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: businesses,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
