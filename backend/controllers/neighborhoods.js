const Neighborhood = require("../models/Neighborhood");
const City = require("../models/City");
const slugify = require("slugify");

exports.getAllNeighborhoods = async (req, res) => {
  try {
    const neighborhoods = await Neighborhood.find().populate("city");
    res.json(neighborhoods);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar bairros." });
  }
};

exports.getNeighborhoodById = async (req, res) => {
  try {
    const neighborhood = await Neighborhood.findById(req.params.id).populate(
      "city"
    );
    if (!neighborhood)
      return res.status(404).json({ error: "Bairro não encontrado." });
    res.json(neighborhood);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar bairro por ID." });
  }
};

exports.getNeighborhoodBySlug = async (req, res) => {
  try {
    const neighborhood = await Neighborhood.findOne({
      slug: req.params.slug,
    }).populate("city");
    if (!neighborhood)
      return res.status(404).json({ error: "Bairro não encontrado." });
    res.json(neighborhood);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar bairro por slug." });
  }
};

exports.getNeighborhoodsByCity = async (req, res) => {
  try {
    const cityId = req.params.cityId;
    const neighborhoods = await Neighborhood.find({ city: cityId }).populate(
      "city"
    );
    res.json(neighborhoods);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar bairros por cidade." });
  }
};

exports.createNeighborhood = async (req, res) => {
  try {
    console.log("Dados recebidos:", req.body); // Adicione para debug

    const { name, city } = req.body;

    if (!name || !city) {
      console.log("Campos faltando:", { name, city }); // Debug
      return res.status(400).json({
        error: "Os campos 'name' e 'city' são obrigatórios.",
        received: req.body,
      });
    }

    // Verifica se a cidade existe
    const cityExists = await City.findById(city);
    if (!cityExists) {
      return res.status(404).json({
        error: "Cidade não encontrada.",
        cityId: city,
      });
    }

    const slug = slugify(name, { lower: true, strict: true });

    // Verificação de duplicata
    const existing = await Neighborhood.findOne({ slug, city });
    if (existing) {
      return res.status(400).json({
        error: "Já existe um bairro com este nome na cidade selecionada",
        existingNeighborhood: existing,
      });
    }

    const neighborhood = new Neighborhood({ name, slug, city });
    await neighborhood.save();

    console.log("Bairro criado:", neighborhood); // Debug
    res.status(201).json(neighborhood);
  } catch (err) {
    console.error("Erro detalhado:", err); // Log mais detalhado
    res.status(400).json({
      error: "Erro ao criar bairro",
      detail: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

exports.updateNeighborhood = async (req, res) => {
  try {
    const { name, city } = req.body;

    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
    }
    if (city) {
      // Verifica se a nova cidade existe
      const cityExists = await City.findById(city);
      if (!cityExists) {
        return res.status(404).json({ error: "Cidade não encontrada." });
      }
      updateData.city = city;
    }

    // Verifica conflito apenas se name ou city foram alterados
    if (updateData.slug || updateData.city) {
      const slug =
        updateData.slug || (await Neighborhood.findById(req.params.id)).slug;
      const cityId =
        updateData.city || (await Neighborhood.findById(req.params.id)).city;

      const existingNeighborhood = await Neighborhood.findOne({
        _id: { $ne: req.params.id }, // Exclui o próprio registro da verificação
        slug,
        city: cityId,
      });

      if (existingNeighborhood) {
        return res.status(400).json({
          error: "Já existe um bairro com este nome na cidade selecionada.",
        });
      }
    }

    const updatedNeighborhood = await Neighborhood.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("city");

    if (!updatedNeighborhood) {
      return res.status(404).json({ error: "Bairro não encontrado." });
    }

    res.json(updatedNeighborhood);
  } catch (err) {
    console.error(err);
    res.status(400).json({
      error: "Erro ao atualizar bairro.",
      detail: err.message,
    });
  }
};

exports.deleteNeighborhood = async (req, res) => {
  try {
    const neighborhood = await Neighborhood.findById(req.params.id);
    if (!neighborhood)
      return res.status(404).json({ error: "Bairro não encontrado." });

    await neighborhood.deleteOne();
    res.json({ message: "Bairro deletado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar bairro." });
  }
};

exports.getNeighborhoods = async (req, res) => {
  try {
    const { city } = req.query;
    let filter = {};

    if (city) {
      // Verifica se a cidade existe pelo slug
      const cityDoc = await City.findOne({ slug: city });
      if (cityDoc) {
        filter.city = cityDoc._id;
      }
    }

    const neighborhoods = await Neighborhood.find(filter).populate("city");
    res.json(neighborhoods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
