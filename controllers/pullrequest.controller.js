const mongoose = require('mongoose');
const Pullrequest = mongoose.model('pullrequests');
const Raven = require('raven');
const axios = require('axios');

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
        seen: true,
      },
    ).populate('repository', {
      name: true,
      fullName: true,
      private: true,
      webUrl: true,
      description: true,
      color: true,
      language: true,
    });
    res.status(200).send(pullrequests);
  } catch (e) {
    Raven.captureException(e);
    res.status(400).send(e);
  }
};

module.exports.update = async (repo, user) => {
  const axiosConfig = {
    headers: { Authorization: 'token ' + user.accessToken },
  };
  const fetchPulls = await axios.get(repo.pullUrl, axiosConfig);

  fetchPulls.data.forEach(async pull => {
    const values = {
      githubId: pull.id,
      number: pull.number,
      webUrl: pull.html_url,
      apiUrl: pull.url,
      state: pull.state,
      title: pull.title,
      comment: pull.body,
      comments: pull.comments || 0,
      owner: user._id,
      repository: repo._id,
      user: {
        githubId: pull.user.id,
        loginName: pull.user.login,
        picture: pull.user.avatar_url,
        apiUrl: pull.user.url,
        webUrl: pull.user.html_url,
      },
      created_at: pull.created_at,
      updated_at: pull.updated_at,
      closed_at: pull.closed_at,
      merged_at: pull.merged_at,
    };

    await new Pullrequest(values).save();
  });
};

module.exports.seen = async (req, res) => {
  try {
    await Pullrequest.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id,
      },
      { $set: { seen: true } },
    );
    res.status(200).send({ id: req.params.id });
  } catch (e) {
    Raven.captureException(e);
    res.status(404).send();
  }
};
