const mongoose = require('mongoose');
const User = mongoose.model('users');
const Raven = require('raven');
const axios = require('axios');
const keys = require('../config/keys');

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

module.exports.private = async (req, res, next) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        permissions: { public: true, private: true, org: false },
      },
    );
    next();
  } catch (e) {
    Raven.captureException(e);
    res.status(400).send(e);
  }
};

module.exports.update = async user => {
  const USER_EMAIL = '/user/emails';
  try {
    const axiosConfig = {
      headers: { Authorization: 'token ' + user.accessToken },
    };
    const fetchEmail = await axios.get(
      `${keys.githubBaseUrl}${USER_EMAIL}`,
      axiosConfig,
    );

    await user.update({
      email: fetchEmail.data[0].email,
    });
  } catch (e) {
    Raven.captureException(e);
  }
};
