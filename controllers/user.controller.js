const mongoose = require('mongoose');
const User = mongoose.model('users');
const Raven = require('raven');

require('../services/raven');

module.exports.me = async (req, res) => {
  try {
    const me = await User.find(
      { _id: req.user.id },
      {
        loginName: true,
        displayName: true,
        email: true,
        picture: true,
        webUrl: true,
      },
    );
    res.status(200).send(me);
  } catch (e) {
    Raven.captureException(e);
    res.status(400).send(e);
  }
};
