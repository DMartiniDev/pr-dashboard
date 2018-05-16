const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('users');

// Remove all sockets on server Reboot
module.exports.removeSockets = async () => {
  const allUsers = await User.find({});
  allUsers.forEach(async user => {
    console.log(user.socket);
    await user.update({ $set: { socket: [] } });
  });
};
