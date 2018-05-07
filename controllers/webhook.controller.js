const mongoose = require('mongoose');
const Pullrequest = mongoose.model('pullrequests');

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
        created_at: req.body.pull_request.created_at,
        updated_at: req.body.pull_request.updated_at,
        closed_at: req.body.pull_request.closed_at,
        merged_at: req.body.pull_request.merged_at,
      });

      await pullrequest.save();
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
