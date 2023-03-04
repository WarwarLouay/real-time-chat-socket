const { Server } = require("socket.io");

const io = new Server({
  cors: "https://warwarlouay.github.io",
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New Connection: " + socket.id);

  socket.on("addNewUser", (uid) => {
    !onlineUsers.some((user) => user.uid === uid) &&
      onlineUsers.push({
        uid,
        socketId: socket.id,
      });

    console.log(onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.uid === message.recipientId);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
      });
    }
  });

  socket.on("onTyping", (uid) => {
    console.log(uid, " is typing");
    io.emit("getOnTyping", uid);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(5000);
