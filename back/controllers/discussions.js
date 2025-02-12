const { Discussion, User, Message } = require("../models/index");

exports.getAll = async (req, res) => {
  try {
    const userId = req.user.id;

    const filteredDiscussionsUsers = req.filteredDiscussions.map(
      (discussion) => ({
        ...discussion,
        Users: discussion.Users.filter((user) => user.id !== userId),
      })
    );

    res.status(200).send({ message: filteredDiscussionsUsers });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error.message });
  }
};

exports.existingDiscussion = async (req, res) => {
  try {
    const filteredDiscussions = await req.filteredDiscussions;
    const existingDiscussion = await filteredDiscussions.find((discussion) => {
      const discussionUserIds = discussion.Users.map((user) => user.id);
      const sortedDiscussionUserIds = discussionUserIds.sort();
      const sortedIdOthersUser = [req.otherUser.id, req.user.id]
        .map(Number)
        .sort();
      return (
        JSON.stringify(sortedDiscussionUserIds) ===
        JSON.stringify(sortedIdOthersUser)
      );
    });
    if (existingDiscussion) {
      const filteredDiscussionsUsers = await {
        ...existingDiscussion,
        Users: existingDiscussion.Users.filter(
          (user) => user.id !== req.user.id
        ),
      };
      return res
        .status(200)
        .send({ message: true, discussion: filteredDiscussionsUsers });
    } else {
      return res.status(200).send({ message: false });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: error.message });
  }
};

exports.createDiscussion = async (req, res) => {
  const { idOthersUser, typeDiscussion, name } = await req.body;
  try {
    const discussion = await Discussion.create({
      name: typeDiscussion === "u" ? null : name,
      nbUnReadMessage: 0,
      type: typeDiscussion,
    });

    await discussion.addUsers([...idOthersUser, req.user.id]);

    const newDiscussion = await Discussion.findOne({
      where: { id: discussion.id },
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
    });
    const discussionsJSON = await newDiscussion.toJSON();

    const filteredDiscussionsUsers = await {
      ...discussionsJSON,
      users: discussionsJSON.Users.filter((user) => user.id !== req.user.id),
    };

    res.status(200).send({ message: filteredDiscussionsUsers });
  } catch (error) {
    console.log(error);

    res.status(404).send({ error: error.message });
  }
};
