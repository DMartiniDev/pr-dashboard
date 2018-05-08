

// mongoose models
require('../models/User');

module.exports.hello = (req, res) => {
  res.send('Hello World!');
  res.status(200);
};
