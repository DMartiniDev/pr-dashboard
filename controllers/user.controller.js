const mongoose = require('mongoose');
const User = mongoose.model('users');
const Raven = require('raven');
const axios = require('axios');
const keys = require('../config/keys');
const Repository = mongoose.model('repositories');

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
  const BASE_URL = 'https://api.github.com';
  const ALL_REPOS = '/user/repos';
  const USER_EMAIL = '/user/emails';

  try {
    const axiosConfig = {
      headers: { Authorization: 'token ' + user.accessToken },
    };
    const fetchRepos = await axios.get(`${BASE_URL}${ALL_REPOS}`, axiosConfig);
    const fetchEmail = await axios.get(`${BASE_URL}${USER_EMAIL}`, axiosConfig);

    await user.update({
      email: fetchEmail.data[0].email,
    });

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
  } catch (e) {
    Raven.captureException(e);
  }
};
