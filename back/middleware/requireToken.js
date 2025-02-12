const jwt = require("jsonwebtoken");
const { User } = require("../models/index");

module.exports = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, "your-secret-key", async (err, decodedToken) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }
    try {
      const user = await User.findByPk(decodedToken.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = await user;
      next();
    } catch (error) {
      console.error("Error authenticating token:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};
