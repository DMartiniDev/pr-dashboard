const mongoose = require('mongoose');
const Pullrequest = mongoose.model('pullrequests');

module.exports.newEvent = async (req, res) => {
  console.log(req.body);
  try {
    const pullrequest = new Pullrequest({
      githubId: req.body.payload.pull_request.id,
      action: req.body.payload.action,
      number: req.body.payload.number,
      webUrl: req.body.payload.pull_request.html_url,
      apiUrl: req.body.payload.pull_request.url,
      state: req.body.payload.pull_request.state,
      title: req.body.payload.pull_request.title,
      comment: req.body.payload.pull_request.body,
      created_at: req.body.payload.pull_request.created_at,
      updated_at: req.body.payload.pull_request.updated_at,
      closed_at: req.body.payload.pull_request.closed_at,
      merged_at: req.body.payload.pull_request.merged_at,
    });

    await pullrequest.save();
    res.status(201).send(pullrequest);
  } catch (e) {
    res.status(400).send(e);
  }
};
