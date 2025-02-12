const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' }); // Renvoie une réponse JSON sous forme de chaîne de caractères
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, 'your-secret-key');

    // Fetch the user information from the database using the decoded user ID
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' }); // Renvoie une réponse JSON sous forme de chaîne de caractères
    }

    // Attach the user object to the request for further use
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' }); // Renvoie une réponse JSON sous forme de chaîne de caractères
  }
};

module.exports = authMiddleware;
