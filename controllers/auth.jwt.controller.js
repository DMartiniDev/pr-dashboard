const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

function generateAccessToken(userId) {
  const expiresIn = '1 hour';
  const issuer = keys.jsonWebTokenIssuer;
  const audience = keys.jsonWebTokenAudience;
  const secret = keys.jsonWebTokenSecret;

  const token = jwt.sign({}, secret, {
    expiresIn,
    audience,
    issuer,
    subject: userId.toString(),
  });

  return token;
}

module.exports.generateUserToken = (req, res) => {
  const accessToken = generateAccessToken(req.user.id);
  res.setHeader('Authorization', accessToken);
  res.redirect(keys.clientUrl);
};
