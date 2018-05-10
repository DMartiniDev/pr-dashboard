const mongoose = require('mongoose');
const User = mongoose.model('users');
const Raven = require('raven');

require('../services/raven');

module.exports.listAll = async (req, res) => {
  try {
    const pullrequests = await User
      .find({ _id: req.user.id })
      .populate({
        path: '_repositories.repository',
        populate: {
          path: '_pullRequests.pullRequest',
        },
      });
    res.status(200).send(pullrequests);
  } catch (e) {
    Raven.captureException(e);
    res.status(400).send(e);
  }
};
