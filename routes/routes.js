const authGithubController = require('../controllers/auth.github.controller');
const webhookController = require('../controllers/webhook.controller');

module.exports = app => {
  // Authentication
  app.get('/api/v1/auth/github', authGithubController.hello);

  // Github Webhooks
  app.post('/api/v1/repo/webhook', webhookController.newEvent);
};
