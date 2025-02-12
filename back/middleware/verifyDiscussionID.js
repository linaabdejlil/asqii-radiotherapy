const { Discussion } = require("../models/index");

module.exports = async (req, res, next, id) => {
  try {
    const discussion = await Discussion.findByPk(id);
    req.discussion = await discussion;
    next();
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error.message });
  }
};
