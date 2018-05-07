const authGithubController = require('../controllers/auth.github.controller');
const webhookController = require('../controllers/webhook.controller');
const pullrequestController = require('../controllers/pullrequest.controller');
const webSocketController = require('../controllers/websockets.controller');

module.exports = app => {
  // Authentication
  app.get('/api/v1/auth/github', authGithubController.hello);

  // Pull requests
  app.get('/api/v1/repo/pullrequests', pullrequestController.listAll);

  // Github Webhooks
  app.post('/api/v1/repo/webhook', webhookController.newEvent);
  
  app.get('/pr-update', webSocketController.test);
};
