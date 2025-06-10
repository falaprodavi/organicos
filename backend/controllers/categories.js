const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar categorias." });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ error: "Categoria não encontrada." });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar categoria por ID." });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category)
      return res.status(404).json({ error: "Categoria não encontrada." });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar categoria por slug." });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "O campo 'name' é obrigatório." });
    }

    const icon = req.file ? req.file.path : null;
    const slug = slugify(name, { lower: true, strict: true });

    const category = new Category({ name, slug, icon });
    await category.save();

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ error: "Erro ao criar categoria.", detail: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;
    let icon;

    if (file) {
      icon = file.path;
    }

    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
    }
    if (icon) {
      updateData.icon = icon;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    res.status(200).json({
      success: true,
      data: updatedCategory,
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ error: "Erro ao atualizar categoria.", detail: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    if (category.icon) {
      try {
        fs.unlinkSync(path.resolve(category.icon));
      } catch (unlinkErr) {
        console.warn("Erro ao excluir ícone:", unlinkErr.message);
      }
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Categoria deletada com sucesso.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar categoria." });
  }
};
