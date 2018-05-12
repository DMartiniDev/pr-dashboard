#!/usr/bin/env node

const keys = require('../config/keys');
const mongoose = require('mongoose');
const axios = require('axios');

require('../models/User');
require('../models/Repository');

const User = mongoose.model('users');
const Repository = mongoose.model('repositories');

// Connect to MongoDB
mongoose.connect(keys.mongoURI);

const BASE_URL = 'https://api.github.com';
const ALL_REPOS = '/user/repos';
const USER_EMAIL = '/user/emails';

async function cronjob() {
  // Fetch all repositories and store in DB
  const allUsers = await User.find();
  await allUsers.forEach(async user => {
    const axiosConfig = {
      headers: { Authorization: 'token ' + user.accessToken },
    };

    const fetchRepos = await axios.get(`${BASE_URL}${ALL_REPOS}`, axiosConfig);
    const fetchEmail = await axios.get(`${BASE_URL}${USER_EMAIL}`, axiosConfig);

    // Update user data
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
  });
  console.log('Cronjob successful finished!');
}

// Handle Promise rejection
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

cronjob();
