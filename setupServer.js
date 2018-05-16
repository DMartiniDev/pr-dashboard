const app = require('express')();
const port = process.env.PORT || 3001;
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
require('./models/User');
const User = mongoose.model('users');

let socket;

io.on('connection', async function(client) {
  socket = client;
  console.log(socket);

  // A connection with a client has been established
  console.log('New connection: ', client.id);

  client.on('hook-id-to-user', async function(username) {
    // Ensure the ID is assigned to the user
    console.log(`Ensure the user ${username} has the SocketID ${client.id}`);
    const existingSocket = await User.findOne({
      loginName: username,
      'socket.socketId': client.id,
    });

    if (!existingSocket) {
      await User.findOneAndUpdate(
        { loginName: username },
        {
          $push: {
            socket: {
              socketId: client.id,
            },
          },
        },
      );
    }
  });

  client.on('disconnect', async function() {
    // Ensure the `client.id` does not exist for any user in the database
    console.log(`Connection dropped: ${client.id}`);
    const remSocket = await User.findOne({
      'socket.socketId': client.id,
    });

    if (remSocket) {
      await remSocket.update({
        $pull: {
          socket: { socketId: client.id },
        },
      });
    }
  });
});

module.exports = {
  app,
  http,
  io,
  socket,
};
