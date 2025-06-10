const SubCategory = require("../models/SubCategory");
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");

// Helper para deletar arquivos
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(path.join("public", filePath))) {
    fs.unlinkSync(path.join("public", filePath));
  }
};

exports.getAllSubCategories = async (req, res) => {
  try {
    const { category, active } = req.query;
    const query = {};

    if (category) query.category = category;
    if (active) query.active = active === "true";

    const subCategories = await SubCategory.find(query)
      .populate("category", "name slug")
      .sort("name");

    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar subcategorias." });
  }
};

exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate(
      "category",
      "name slug"
    );

    if (!subCategory) {
      return res.status(404).json({ error: "Subcategoria não encontrada." });
    }
    res.json(subCategory);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar subcategoria por ID." });
  }
};

exports.getSubCategoryBySlug = async (req, res) => {
  try {
    const subCategory = await SubCategory.findOne({
      slug: req.params.slug,
    }).populate("category", "name slug");

    if (!subCategory) {
      return res.status(404).json({ error: "Subcategoria não encontrada." });
    }
    res.json(subCategory);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar subcategoria por slug." });
  }
};

exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;

    // Encontra a categoria pelo slug para obter o ID
    const category = await Category.findOne({ slug: categorySlug });

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    const subCategories = await SubCategory.find({
      category: category._id,
      active: true,
    }).select("name slug icon");

    res.json(subCategories);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao buscar subcategorias por categoria." });
  }
};

exports.getSubCategoriesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const subCategories = await SubCategory.find({
      category: categoryId,
    }).populate("category");

    res.json(subCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar subcategorias" });
  }
};

exports.createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const icon = req.file
      ? `/uploads/subcategories/${req.file.filename}`
      : null;

    if (!name || !category) {
      if (req.file) deleteFile(req.file.path);
      return res.status(400).json({
        error: "Os campos 'name' e 'category' são obrigatórios.",
      });
    }

    // Verifica se a categoria existe
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      if (req.file) deleteFile(req.file.path);
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    // Verifica se já existe uma subcategoria com o mesmo nome para esta categoria
    const existingSubCategory = await SubCategory.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      category,
    });

    if (existingSubCategory) {
      if (existingSubCategory.active) {
        if (req.file) deleteFile(req.file.path);
        return res.status(400).json({
          error: "Subcategoria já existe nesta categoria.",
        });
      } else {
        // Reativa a subcategoria existente
        existingSubCategory.active = true;
        if (icon) {
          if (existingSubCategory.icon) deleteFile(existingSubCategory.icon);
          existingSubCategory.icon = icon;
        }
        await existingSubCategory.save();
        return res.status(200).json(existingSubCategory);
      }
    }

    // Cria nova subcategoria
    const subCategory = new SubCategory({
      name,
      category,
      icon,
      active: true,
    });

    await subCategory.save();
    res.status(201).json(subCategory);
  } catch (err) {
    if (req.file) deleteFile(req.file.path);
    res.status(400).json({
      error: "Erro ao criar subcategoria.",
      detail: err.message,
    });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const { name, category, active } = req.body;
    const icon = req.file
      ? `/uploads/subcategories/${req.file.filename}`
      : undefined;

    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      if (req.file) deleteFile(req.file.path);
      return res.status(404).json({ error: "Subcategoria não encontrada." });
    }

    // Atualizações
    const updateData = {};
    if (name) updateData.name = name;
    if (category) {
      // Verifica se a nova categoria existe
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        if (req.file) deleteFile(req.file.path);
        return res.status(404).json({ error: "Categoria não encontrada." });
      }
      updateData.category = category;
    }
    if (active !== undefined) updateData.active = active;
    if (icon) {
      if (subCategory.icon) deleteFile(subCategory.icon);
      updateData.icon = icon;
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("category", "name slug");

    res.json(updatedSubCategory);
  } catch (err) {
    if (req.file) deleteFile(req.file.path);
    res.status(400).json({
      error: "Erro ao atualizar subcategoria.",
      detail: err.message,
    });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    // Soft delete (marca como inativo)
    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!subCategory) {
      return res.status(404).json({ error: "Subcategoria não encontrada." });
    }

    res.json({
      message: "Subcategoria desativada com sucesso.",
      subCategory,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao desativar subcategoria." });
  }
};

exports.hardDeleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {
      return res.status(404).json({ error: "Subcategoria não encontrada." });
    }

    // Remove o ícone se existir
    if (subCategory.icon) {
      deleteFile(subCategory.icon);
    }

    // Deleta permanentemente
    await subCategory.deleteOne();

    res.json({ message: "Subcategoria deletada permanentemente com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar subcategoria." });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category) {
      // Verifica se a categoria existe pelo slug
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    const subCategories = await SubCategory.find(filter).populate("category");
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
