const authGithubController = require('../controllers/auth.github.controller');
const webhookController = require('../controllers/webhook.controller');
const pullrequestController = require('../controllers/pullrequest.controller');
const webSocketController = require('../controllers/websockets.controller');
const githubMiddleware = require('../middleware/github');

module.exports = app => {
  // Authentication
  app.get('/v1/auth/github', authGithubController.hello);
  // app.get('/v1/auth/github/callback', authGithubController.callback);

  // Pull requests
  app.get('/v1/pullrequests', pullrequestController.listAll);

  // Github Webhooks
  app.post('/v1/webhooks', githubMiddleware, webhookController.newEvent);
  app.patch('/v1/repos/:id/enable', webhookController.enable);
  app.patch('/v1/repos/:id/disable', webhookController.disable);

  // Temporary Websockets communication
  app.get('/pr-update', webSocketController.test);
};
