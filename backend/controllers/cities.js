const Business = require("../models/Business");
const City = require("../models/City");
const slugify = require("slugify");
const { cloudinary } = require("../config/cloudinary");

exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar cidades." });
  }
};

exports.getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ error: "Cidade não encontrada." });
    res.json(city);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar cidade por ID." });
  }
};

exports.getCityBySlug = async (req, res) => {
  try {
    const city = await City.findOne({ slug: req.params.slug });
    if (!city) return res.status(404).json({ error: "Cidade não encontrada." });
    res.json(city);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar cidade por slug." });
  }
};

exports.createCity = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "O campo 'name' é obrigatório." });
    }

    let image = null;
    let imagePublicId = null;

    if (req.file) {
      image = req.file.path; // URL completa do Cloudinary
      imagePublicId = req.file.filename; // geralmente filename é igual ao public_id
    }

    const slug = slugify(name, { lower: true, strict: true });

    const city = new City({ name, slug, image, imagePublicId });
    await city.save();
    res.status(201).json(city);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ error: "Erro ao criar cidade.", detail: err.message });
  }
};

exports.updateCity = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    const updateData = {};

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
    }

    if (file) {
      updateData.image = file.path;
      updateData.imagePublicId = file.filename;
    }

    const updatedCity = await City.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCity) {
      return res.status(404).json({ error: "Cidade não encontrada." });
    }

    res.json(updatedCity);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ error: "Erro ao atualizar cidade.", detail: err.message });
  }
};

exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "Cidade não encontrada",
      });
    }

    // Se tiver imagem no Cloudinary, deleta
    if (city.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(city.imagePublicId);
        console.log("Imagem do Cloudinary excluída:", city.imagePublicId);
      } catch (err) {
        console.error("Erro ao excluir imagem do Cloudinary:", err);
      }
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error("Erro ao excluir cidade:", err);
    res.status(500).json({
      success: false,
      message: "Não foi possível excluir a cidade",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

exports.getPopularCities = async (req, res) => {
  try {
    const result = await Business.aggregate([
      {
        $group: {
          _id: "$address.city",
          totalBusinesses: { $sum: 1 },
        },
      },
      { $sort: { totalBusinesses: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: "cities",
          localField: "_id",
          foreignField: "_id",
          as: "city",
        },
      },
      { $unwind: "$city" },
      {
        $project: {
          _id: "$city._id",
          name: "$city.name",
          slug: "$city.slug",
          image: "$city.image",
          totalBusinesses: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar cidades populares",
    });
  }
};
