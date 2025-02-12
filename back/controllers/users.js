//controllers/user.js
const { User } = require("../models/index");
const { Op } = require("sequelize");

exports.getUser = async (req, res) => {
  const { user } = await req;
  try {
    user.password = null;
    res.status(200).send({ message: user });
  } catch (error) {
    res.status(400).send({ error: error });
  }
};
exports.getSurgeonsRadiologists = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: {
          [Op.or]: ["chirurgien", "radiothérapeute"],
        },
      },
      attributes: { exclude: ["password"] }, // Exclude the password field from the results
    });
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: "Error fetching users: " + error.message });
  }
};

exports.getOtherUser = async (req, res) => {
  const { otherUser } = await req;
  try {
    otherUser.password = null;
    res.status(200).send({ message: otherUser });
  } catch (error) {
    res.status(400).send({ error: error });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const order = [["nom", "ASC"]];
    const offset = (page - 1) * limit;

    const filter = req.query.nom
      ? { nom: { [Op.like]: `%${req.query.nom}%` } }
      : {};

    const users = await User.findAndCountAll({
      where: {
        ...filter,
        id: { [Op.ne]: req.user.id },
      },
      attributes: { exclude: ["password"] },
      order,
      limit,
      offset,
    });

    res.status(200).send({
      currentPage: page,
      totalPages: Math.ceil(users.count / limit),
      users: users.rows,
    });
  } catch (error) {
    res.status(400).send({ error: error });
  }
};
