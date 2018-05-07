const mongoose = require('mongoose');
const Pullrequest = mongoose.model('pullrequests');
const Repository = mongoose.model('repositories');

// TODO: Accept only requests which are coming from Github & check the Secret
module.exports.newEvent = async (req, res) => {
  const existPullrequest = await Pullrequest.findOne({ githubId: req.body.pull_request.id });
  if (!existPullrequest) {
    try {
      const pullrequest = new Pullrequest({
        githubId: req.body.pull_request.id,
        action: req.body.action,
        number: req.body.number,
        webUrl: req.body.pull_request.html_url,
        apiUrl: req.body.pull_request.url,
        state: req.body.pull_request.state,
        title: req.body.pull_request.title,
        comment: req.body.pull_request.body,
        user: {
          githubId: req.body.pull_request.user.id,
          loginName: req.body.pull_request.user.login,
          picture: req.body.pull_request.user.avatar_url,
          apiUrl: req.body.pull_request.user.url,
          webUrl: req.body.pull_request.user.html_url,
        },
        created_at: req.body.pull_request.created_at,
        updated_at: req.body.pull_request.updated_at,
        closed_at: req.body.pull_request.closed_at,
        merged_at: req.body.pull_request.merged_at,
      });

      await pullrequest.save();

      // Add pull request to Repository
      await Repository.findOneAndUpdate({ githubId: req.body.repository.id }, {
        $push: {
          pullRequests: pullrequest._id,
        },
      });

      res.status(201).send(pullrequest);
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    res.status(409).send({
      message: 'Pull request already exist.',
    });
  }
};
