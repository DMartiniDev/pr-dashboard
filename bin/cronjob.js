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
const PUBLIC_REPO = '/user/repos?type=public';
const USER_EMAIL = '/user/emails';

async function cronjob() {
  // Fetch all public repositories and store in DB
  const allUsers = await User.find();
  await allUsers.forEach(async user => {
    const axiosConfig = {
      headers: { Authorization: 'token ' + user.accessToken },
    };

    const fetchRepos = await axios.get(
      `${BASE_URL}${PUBLIC_REPO}`,
      axiosConfig,
    );
    const fetchEmail = await axios.get(
      `${BASE_URL}${USER_EMAIL}`,
      axiosConfig,
    );

    // Update user data
    await user.update({
      email: fetchEmail.data[0].email,
    });

    fetchRepos.data.forEach(async publicRepos => {
      const existingRepo = await Repository.findOne({
        githubId: publicRepos.id,
      });

      const values = {
        githubId: publicRepos.id,
        name: publicRepos.name,
        fullName: publicRepos.full_name,
        private: publicRepos.private,
        webUrl: publicRepos.html_url,
        apiUrl: publicRepos.url,
        hookUrl: publicRepos.hooks_url,
        pullUrl: publicRepos.pulls_url,
        description: publicRepos.description,
        language: publicRepos.language,
        created_at: publicRepos.created_at,
        updated_at: publicRepos.updated_at,
      };

      if (!existingRepo) {
        await new Repository(values).save();
        await user.update({
          $push: { _repositories: { repository: publicRepos._id } },
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

        await axios.post(publicRepos.hooks_url, webhookData, axiosConfig);
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
