const { Message } = require("../models/index");

module.exports = async (req, res, next, id) => {
  try {
    const message = await Message.findByPk(id);
    req.message = await message;
    next();
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error.message });
  }
};
