const app = require('express')();
const port = process.env.PORT || 3001;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', function(client){
  // A connection with a client has been established
  console.log('New connection: ', client.id);

  client.on('hook-id-to-user', function(username){
    // Ensure the ID is assigned to the user
    console.log(`Ensure the user ${username} has the SocketID ${client.id}`);
  });

  client.on('disconnect', function(){
    // TODO: Ensure the `client.id` does not exist for any user in the database
    console.log(`Connection dropped: ${client.id}`);
  });
});

module.exports = {
  app,
  http,
  io
}