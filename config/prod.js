require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
};
