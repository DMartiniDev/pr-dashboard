const authGithubController = require('../controllers/auth.github.controller');
const authJwtController = require('../controllers/auth.jwt.controller');
const webhookController = require('../controllers/webhook.controller');
const pullrequestController = require('../controllers/pullrequest.controller');
const webSocketController = require('../controllers/websockets.controller');
const githubMiddleware = require('../middleware/github');
const requireAuth = require('../middleware/requireAuth');

module.exports = app => {
  // Authentication
  app.get('/v1/auth/github', authGithubController.auth());
  app.get('/v1/auth/callback', authGithubController.callback(), authJwtController.generateUserToken);

  // Pull requests
  app.get('/v1/pullrequests', requireAuth(), pullrequestController.listAll);

  // Github Webhooks
  app.post('/v1/webhooks', githubMiddleware, webhookController.newEvent);
  app.patch('/v1/repos/:id/enable', requireAuth(), webhookController.enable);
  app.patch('/v1/repos/:id/disable', requireAuth(), webhookController.disable);

  // Temporary Websockets communication
  app.get('/pr-update', webSocketController.test);
  app.get('/repos-update', webSocketController.reposUpdate);
};
