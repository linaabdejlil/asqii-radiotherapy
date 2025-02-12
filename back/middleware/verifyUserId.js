const { User } = require("../models/index");

module.exports = async (req, res, next, id) => {
  try {
    const otherUser = await User.findByPk(id);
    req.otherUser = await otherUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error.message });
  }
};
