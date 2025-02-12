const { Message, User } = require("../models/index");

exports.getAllMessage = async (req, res) => {
  try {
    const discussionId = await req.discussion.id;
    const messages = await Message.findAll({
      where: {
        discussionId: discussionId,
      },
      order: [["updatedAt", "ASC"]],
    });
    res.status(200).send({ message: messages });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const senderId = await req.user.id;
    const discussionId = await req.discussion.id;
    const content = await req.body.content;

    const message = await Message.create({ senderId, discussionId, content });

    await req.discussion.update({ idLastMessage: message.id });

    await req.discussion.setLastMessage(message);

    const newMessage = await Message.findOne({
      where: { id: message.id },
      include: [
        {
          model: User,
          as: "sender",
          
        },
      ],
    });
    res.status(200).send({ message: newMessage });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error.message });
  }
};

exports.getMessageById = async (req, res) => {
  const { message } = await req;
  try {
    res.status(200).send({ message: message });
  } catch (error) {
    res.status(400).send({ error: error });
  }
};
