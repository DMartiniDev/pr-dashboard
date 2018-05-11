const mongoose = require('mongoose');
const Repository = mongoose.model('repositories');
const Raven = require('raven');

require('../services/raven');

module.exports.listAll = async (req, res) => {
  try {
    const repositories = await Repository.find(
      { owner: req.user.id },
      {
        name: true,
        fullName: true,
        private: true,
        webUrl: true,
        description: true,
        hookEnabled: true,
      },
    );
    res.status(200).send(repositories);
  } catch (e) {
    Raven.captureException(e);
    res.status(400).send();
  }
};

module.exports.listPullrequests = async (req, res) => {
  try {
    const pullrequests = await Repository.find(
      {
        owner: req.user.id,
        _id: req.params.id,
      },
      {
        name: true,
        fullName: true,
        private: true,
        webUrl: true,
        description: true,
        hookEnabled: true,
        _pullRequests: true,
      },
    ).populate('_pullRequests.pullRequest', {
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
    });
    res.status(200).send(pullrequests);
  } catch (e) {
    Raven.captureException(e);
    res.status(400).send();
  }
};
