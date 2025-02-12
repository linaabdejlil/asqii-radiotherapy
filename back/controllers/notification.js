const { Notification, User } = require("../models");

exports.getUserNotifications = async (req, res) => {
  const userId = req.user.id; // Récupérer l'ID de l'utilisateur authentifié à partir du middleware d'authentification

  try {
    const notifications = await Notification.findAll({
      where: { recipientId: userId, read: false },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
