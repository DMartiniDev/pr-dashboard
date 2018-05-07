
module.exports.newEvent = (req, res) => {
  console.log('github request', req.body);
  res.status(200).send({ success: 'ok' })
};
