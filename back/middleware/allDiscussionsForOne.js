const { Discussion, User, Message } = require("../models/index");

module.exports = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const discussions = await Discussion.findAll({
      include: [
        {
          model: User,
          as: "Users",
          attributes: { exclude: ["password"] },
          through: {
            attributes: [],
          },
        },
        {
          model: Message,
          as: "messages",
        },
        {
          model: Message,
          as: "lastMessage",
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    const discussionsJSON = discussions.map((discussion) =>
      discussion.toJSON()
    );

    const filteredDiscussions = discussionsJSON.filter((discussion) =>
      discussion?.Users?.some((user) => user.id === userId)
    );
    for (let discussion of filteredDiscussions) {
      const messages = await Message.findAll({
        where: { discussionId: discussion.id },
        include: [
          {
            model: User,
            as: "sender",
            attributes: { exclude: ["password"] },
          },
        ],
        order: [["updatedAt", "ASC"]],
      });
      discussion.messages = messages;
    }

    req.filteredDiscussions = await filteredDiscussions;
    next();
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error.message });
  }
};
