const mongoose = require('mongoose');
const Pullrequest = mongoose.model('pullrequests');
const Repository = mongoose.model('repositories');
const axios = require('axios');
const keys = require('../config/keys');
const Raven = require('raven');

require('../services/raven');

module.exports.newEvent = async (req, res) => {
  // First message to test the Webhook from Github
  if (req.body.zen && req.body.hook) return res.status(200).send();

  const {
    id,
    html_url,
    url,
    state,
    title,
    body,
    comments,
    user,
    created_at,
    updated_at,
    closed_at,
    merged_at,
  } = req.body.pull_request;
  const existPullrequest = await Pullrequest.findOne({ githubId: id });
  const values = {
    githubId: id,
    action: req.body.action,
    number: req.body.number,
    webUrl: html_url,
    apiUrl: url,
    state: state,
    title: title,
    comment: body,
    comments: comments,
    user: {
      githubId: user.id,
      loginName: user.login,
      picture: user.avatar_url,
      apiUrl: user.url,
      webUrl: user.html_url,
    },
    created_at: created_at,
    updated_at: updated_at,
    closed_at: closed_at,
    merged_at: merged_at,
  };

  if (!existPullrequest) {
    try {
      const repo = await Repository.findOne({
        githubId: req.body.repository.id,
      });
      values.repository = repo;

      const pullrequest = new Pullrequest(values);
      await pullrequest.save();

      await repo.update({
        $push: { _pullRequests: { pullRequest: pullrequest._id } },
      });

      res.status(201).send({ message: 'Pull request created.' });
    } catch (e) {
      Raven.captureException(e);
      res.status(400).send(e);
    }
  } else {
    try {
      await existPullrequest.update(values);
      res.status(201).send({ message: 'Pull request updated.' });
    } catch (e) {
      Raven.captureException(e);
      res.status(400).send(e);
    }
  }
};

module.exports.enable = async (req, res) => {
  const repo = await Repository.findOne({
    _id: req.params.id,
    owner: req.user.id,
    hookEnabled: false,
  });

  if (!repo) return res.status(404).send();

  const webHookData = {
    name: 'web',
    active: true,
    events: ['pull_request'],
    config: {
      url: keys.githubWebhookUrl,
      content_type: 'json',
      secret: keys.githubWebhookSecret,
    },
  };
  const axiosConfig = {
    headers: { Authorization: 'token ' + req.user.accessToken },
  };
  try {
    const webhook = await axios.post(repo.hookUrl, webHookData, axiosConfig);
    await repo.update({
      hookEnabled: true,
      hookId: webhook.data.id,
    });

    res.status(204).send();
  } catch (e) {
    Raven.captureException(e);
    res.status(500).send();
  }
};

module.exports.disable = async (req, res) => {
  const repo = await Repository.findOne({
    _id: req.params.id,
    owner: req.user.id,
    hookEnabled: true,
  });

  if (!repo) return res.status(404).send();

  const axiosConfig = {
    headers: { Authorization: 'token ' + req.user.accessToken },
  };

  try {
    await axios.delete(`${repo.hookUrl}/${repo.hookId}`, axiosConfig);
    await repo.update({
      hookEnabled: false,
      hookId: null,
    });

    res.status(204).send();
  } catch(e) {
    Raven.captureException(e);
    res.status(500).send();
  }
};
