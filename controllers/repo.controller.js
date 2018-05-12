const mongoose = require('mongoose');
const Repository = mongoose.model('repositories');
const Raven = require('raven');
const axios = require('axios');
const keys = require('../config/keys');

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

module.exports.update = async (user) => {
  const axiosConfig = {
    headers: { Authorization: 'token ' + user.accessToken },
  };
  const ALL_REPOS = '/user/repos';
  const fetchRepos = await axios.get(`${keys.githubBaseUrl}${ALL_REPOS}`, axiosConfig);

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
      pullUrl: allRepos.pulls_url,
      description: allRepos.description,
      language: allRepos.language,
      owner: user._id,
      created_at: allRepos.created_at,
      updated_at: allRepos.updated_at,
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
      }
    } else {
      await existingRepo.update(values);
    }
  });
};
