
module.exports.newEvent = (req, res) => {
  console.log('request body: ', req.body);
  console.log('request header: ', req.headers);
  res.status(200).send({ success: 'ok' })
};
