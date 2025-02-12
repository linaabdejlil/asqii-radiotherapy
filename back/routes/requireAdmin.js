const { User } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (user.role === "admin") {
      next();
    } else {
      throw new Error("Vous n'êtes pas autorisé à accéder à cette ressource.");
    }
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: "Accès refusé" });
  }
};
