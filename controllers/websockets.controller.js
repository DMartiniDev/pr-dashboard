const { io } = require('../setupServer.js');

module.exports.test = (req, res) => {
  io.emit('pr-update', {
    title:'New Data',
    data: {
      message:'Some data being sent using Web Sockets',
      date: new Date().toISOString()
    }
  });
  res.status(200).send('A message has been sent to the client');
};
