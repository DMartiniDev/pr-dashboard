require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  jsonWebTokenSecret: process.env.JSON_WEB_TOKEN_SECRET,
  jsonWebTokenIssuer: process.env.JSON_WEB_TOKEN_ISSUER,
  jsonWebTokenAudience: process.env.JSON_WEB_TOKEN_AUDIENCE,
};
