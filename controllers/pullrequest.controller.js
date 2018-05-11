const mongoose = require('mongoose');
const Pullrequest = mongoose.model('pullrequests');
const Raven = require('raven');

require('../services/raven');

module.exports.listAll = async (req, res) => {
  try {
    const pullrequests = await Pullrequest.find(
      { owner: req.user.id },
      {
        user: true,
        closed_at: true,
        merged_at: true,
        created_at: true,
        updated_at: true,
        action: true,
        number: true,
        webUrl: true,
        state: true,
        title: true,
        review: true,
        comment: true,
        comments: true,
        repository: true,
      },
    ).populate('repository', {
      name: true,
      fullName: true,
      private: true,
      webUrl: true,
      description: true,
    });
    res.status(200).send(pullrequests);
  } catch (e) {
    Raven.captureException(e);
    res.status(400).send(e);
  }
};
