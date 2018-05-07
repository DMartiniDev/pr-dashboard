const mongoose = require('mongoose');
const Pullrequest = mongoose.model('pullrequests');

module.exports.listAll = async (req, res) => {
  try {
    const pullrequests = await Pullrequest.find({});
    res.status(200).send(pullrequests);
  } catch (e) {
    res.status(400).send(e);
  }
}
