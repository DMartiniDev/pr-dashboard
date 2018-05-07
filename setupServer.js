const app = require('express')();
const port = process.env.PORT || 3001;
const http = require('http').createServer(app);
const io = require('socket.io')(http);

module.exports = {
  app,
  http,
  io
}