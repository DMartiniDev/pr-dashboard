require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  serverBaseUrl: process.env.SERVER_BASE_URL,
  githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  githubWebhookUrl: process.env.GITHUB_WEBHOOK_URL,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubBaseUrl: process.env.GITHUB_BASEURL_API,
  jsonWebTokenSecret: process.env.JSON_WEB_TOKEN_SECRET,
  jsonWebTokenIssuer: process.env.JSON_WEB_TOKEN_ISSUER,
  jsonWebTokenAudience: process.env.JSON_WEB_TOKEN_AUDIENCE,
  sentryDsn: process.env.SENTRY_DSN,
  clientUrl: process.env.CLIENT_URL,
};
