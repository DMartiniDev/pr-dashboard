const bodyParser = require('body-parser');
const authGithubController = require('../controllers/auth.github.controller');
const webhookController = require('../controllers/webhook.controller');
const pullrequestController = require('../controllers/pullrequest.controller');
const webSocketController = require('../controllers/websockets.controller');
const githubMiddleware = require('../middleware/github');

module.exports = app => {
  // Authentication
  app.get('/api/v1/auth/github', authGithubController.hello);

  // Pull requests
  app.get('/api/v1/repo/pullrequests', pullrequestController.listAll);

  // Github Webhooks
  app.post('/api/v1/repo/webhook', githubMiddleware, webhookController.newEvent);

  app.get('/pr-update', webSocketController.test);
};
