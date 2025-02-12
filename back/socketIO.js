const socketIo = require("socket.io");
// const { Notification } = require("./models"); // Assurez-vous que le chemin est correct

let io;
const users = new Map();

const initializeSocket = async (server) => {
  io = await socketIo(server, {
    cors: {
      origin: process.env.SOCKET || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("setUserId", async ({ UserId }) => {
      console.log("id user conncter", UserId);
      if (UserId) {
        users.set(UserId.toString(), socket.id);
      } else {
        console.log("User id is null");
      }
    });

    socket.on(
      "privateMessage",
      async ({ senderId, recipientIds, message, newDiscussion }) => {
        recipientIds.forEach(async (recipientId) => {
          if (users.has(recipientId.id.toString())) {
            const recipientSocketId = await users.get(
              recipientId.id.toString()
            );
            if (recipientSocketId) {
              await io.to(recipientSocketId).emit("privateMessage", {
                message: message,
                discussionStatus: newDiscussion,
                senderId: senderId,
              });
              await io.to(recipientSocketId).emit("privateMessageSideBar");
            }
          } else {
            console.log(`Recipient ${recipientId.id} not found in users map`);
          }
        });
      }
    );

    socket.on("writingMessage", async ({ senderId, recipientIds }) => {
      recipientIds.forEach(async (recipientId) => {
        if (users.has(recipientId.id.toString())) {
          const recipientSocketId = await users.get(recipientId.id.toString());
          if (recipientSocketId) {
            await io
              .to(recipientSocketId)
              .emit("writingMessage", { id: senderId });
          }
        } else {
          console.log(`Recipient ${recipientId.id} not found in users map`);
        }
      });
    });

    socket.on("notWritingMessage", async ({ senderId, recipientIds }) => {
      recipientIds.forEach(async (recipientId) => {
        if (users.has(recipientId.id.toString())) {
          const recipientSocketId = await users.get(recipientId.id.toString());
          if (recipientSocketId) {
            await io
              .to(recipientSocketId)
              .emit("notWritingMessage", { id: senderId });
          }
        } else {
          console.log(`Recipient ${recipientId.id} not found in users map`);
        }
      });
    });

    socket.on("disconnect", async () => {
      users.forEach((value, key) => {
        if (value === socket.id) {
          users.delete(key);
        }
      });
    });
  });

  return io;
};
const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

const sendNotification = async (notification) => {
  // const recipientId = notification.recipientId.toString();
  const recipientSocketId = await users.get("3");
  if (recipientSocketId) {
    await io.to(recipientSocketId).emit("newNotification", notification);
    console.log("New notification emitted:", notification); // Vérifier dans la console que la notification est émise
  }
  // if (users.has(recipientId)) {
  // } else {
  //   console.log(`Recipient ${recipientId} not found in users map`);
  // }
};

module.exports = { initializeSocket, getIo, sendNotification };
