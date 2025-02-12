const { Op } = require("sequelize");
const CentreTraitement = require("../models/centreTraitement");

// Create
exports.createCentreTraitement = async (req, res) => {
  try {
    const centreTraitement = await CentreTraitement.create(req.body);
    res.status(201).json(centreTraitement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Read
exports.getAllCentresTraitement = async (req, res) => {
  try {
    const centresTraitement = await CentreTraitement.findAll();
    res.status(200).json(centresTraitement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCentreTraitementById = async (req, res) => {
  try {
    const { id } = req.params;
    const centreTraitement = await CentreTraitement.findByPk(id);
    if (!centreTraitement) {
      return res
        .status(404)
        .json({ error: "Centre de traitement introuvable" });
    }
    res.status(200).json(centreTraitement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update
exports.updateCentreTraitement = async (req, res) => {
  try {
    const { id } = req.params;
    let centreTraitement = await CentreTraitement.findByPk(id);
    if (!centreTraitement) {
      return res
        .status(404)
        .json({ error: "Centre de traitement introuvable" });
    }
    centreTraitement = await centreTraitement.update(req.body);
    res.status(200).json(centreTraitement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete
exports.deleteCentreTraitement = async (req, res) => {
  try {
    const { id } = req.params;
    const centreTraitement = await CentreTraitement.findByPk(id);
    if (!centreTraitement) {
      return res
        .status(404)
        .json({ error: "Centre de traitement introuvable" });
    }
    await centreTraitement.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search by name
exports.searchCentreTraitementByName = async (req, res) => {
  try {
    const { nom } = req.query;
    const centresTraitement = await CentreTraitement.findAll({
      where: {
        nom: {
          [Op.iLike]: `%${nom}%`,
        },
      },
    });
    res.status(200).json(centresTraitement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
