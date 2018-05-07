const crypto = require('crypto');

module.exports = (req, res, next) => {
  const allowedUserAgent = 'GitHub-Hookshot/';
  const reqUserAgent = req.headers['user-agent'].match(/.+?\//gi).toString();

  if (reqUserAgent !== allowedUserAgent) {
    return res.status(403).send({ message: 'Method not allowed.' });
  };

  let hmac = crypto.createHmac('sha1', 'Codeworks1');
  hmac.update(JSON.stringify(req.body));
  const calculatedSignature = 'sha1=' + hmac.digest('hex');

  console.log(calculatedSignature);
  next();
};

// function getSignature(buf) {
//   let hmac = crypto.createHmac('sha1', 'Codeworks1');
//   hmac.update(buf, 'utf-8');
//   return 'sha1=' + hmac.digest('hex');
// }
//
// const signature = req.headers['x-hub-signature'];
// const calculated = await getSignature(buf);
// console.log(calculated, signature);

