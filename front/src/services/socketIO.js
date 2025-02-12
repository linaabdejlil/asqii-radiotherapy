import io from "socket.io-client";

const socketIO = io("http://localhost:4000");
socketIO.emit("setUserId", { UserId: localStorage.getItem("user") });

export default socketIO;
