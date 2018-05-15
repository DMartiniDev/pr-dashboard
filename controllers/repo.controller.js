const mongoose = require('mongoose');
const Repository = mongoose.model('repositories');
const User = mongoose.model('users');
const Pullrequest = mongoose.model('pullrequests');
const Raven = require('raven');
const axios = require('axios');
const keys = require('../config/keys');
const pullrequestController = require('./pullrequest.controller');

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
        color: true,
        language: true,
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

module.exports.update = async user => {
  const axiosConfig = {
    headers: { Authorization: 'token ' + user.accessToken },
  };
  const ALL_REPOS = '/user/repos';
  const fetchRepos = await axios.get(
    `${keys.githubBaseUrl}${ALL_REPOS}`,
    axiosConfig,
  );

  fetchRepos.data.forEach(async allRepos => {
    const existingRepo = await Repository.findOne({
      githubId: allRepos.id,
    });

    const values = {
      githubId: allRepos.id,
      name: allRepos.name,
      fullName: allRepos.full_name,
      private: allRepos.private,
      webUrl: allRepos.html_url,
      apiUrl: allRepos.url,
      hookUrl: allRepos.hooks_url,
      pullUrl: allRepos.pulls_url.replace('{/number}', ''),
      description: allRepos.description,
      language: allRepos.language,
      owner: user._id,
      created_at: allRepos.created_at,
      updated_at: allRepos.updated_at,
      synced_at: Date.now(),
    };

    if (!existingRepo) {
      const newRepo = await new Repository(values).save();
      await user.update({
        $push: {
          _repositories: {
            repository: newRepo._id,
            permissions: {
              admin: allRepos.permissions.admin,
              push: allRepos.permissions.push,
              pull: allRepos.permissions.pull,
            },
          },
        },
      });

      // Create new Webhook
      const webhookData = {
        name: 'web',
        active: true,
        events: ['pull_request'],
        config: {
          url: keys.githubWebhookUrl,
          content_type: 'json',
          secret: keys.githubWebhookSecret,
        },
      };

      if (allRepos.permissions.admin === true) {
        const webhook = await axios.post(
          allRepos.hooks_url,
          webhookData,
          axiosConfig,
        );
        await newRepo.update({ hookId: webhook.data.id });
        await pullrequestController.update(newRepo, user.accessToken);
      }
    } else {
      await existingRepo.update(values);
    }
  });
};

module.exports.delete = async user => {
  const oldRepos = await Repository.find({
    owner: user._id,
    synced_at: { $lte: new Date().getTime() - 60 * 60 * 1000 * 24 },
  });
  if (oldRepos.length > 0) {
    oldRepos.forEach(async repo => {
      // Remove old Repos from Users Array
      await User.update(
        { _id: user._id },
        {
          $pull: {
            _repositories: {
              repository: mongoose.Types.ObjectId(repo._id),
            },
          },
        },
      );

      // Remove Pullrequests of this Repositories
      await Pullrequest.remove({ repository: repo._id });

      // Remove Repository
      await Repository.remove({ _id: repo._id });
    });
  }
};

module.exports.color = async (req, res) => {
  if (!req.body.color) return res.status(404).send();

  const repo = await Repository.findOne({
    _id: req.params.id,
    owner: req.user.id,
  });

  if (!repo) return res.status(404).send();

  try {
    await repo.update({
      color: req.body.color,
    });
    res.status(204).send();
  } catch (e) {
    Raven.captureException(e);
    res.status(500).send();
  }
};
