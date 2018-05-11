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
