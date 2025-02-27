const { Server } = require("socket.io");

let waitingUsers = [];

const setupSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    waitingUsers.push(socket);

    if (waitingUsers.length >= 2) {
      const user1 = waitingUsers.shift();
      const user2 = waitingUsers.shift();

      user1.emit("matchFound", { partnerId: user2.id });
      user2.emit("matchFound", { partnerId: user1.id });
    }

    socket.on("disconnect", () => {
      waitingUsers = waitingUsers.filter((user) => user !== socket);
    });
  });
};

module.exports = setupSocket;
