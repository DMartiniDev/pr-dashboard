#!/usr/bin/env node

const keys = require('../config/keys');
const mongoose = require('mongoose');
const axios = require('axios');
const Raven = require('raven');

require('../models/User');
require('../models/Repository');

const userController = require('../controllers/user.controller');
const repoController = require('../controllers/repo.controller');

const User = mongoose.model('users');

// Connect to MongoDB
mongoose.connect(keys.mongoURI);

async function cronjob() {
  // Fetch all repositories and store in DB
  const allUsers = await User.find();
  await allUsers.forEach(async user => {
    await userController.update(user);
    await repoController.update(user);
  });
  console.log('Cronjob successful finished!');
}

// Handle Promise rejection
process.on('unhandledRejection', (reason, p) => {
  Raven.captureException('Unhandled Rejection at:', p, 'reason:', reason);
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

cronjob();
