const authGithubController = require('../controllers/auth.github.controller');
const webSocketController = require('../controllers/websockets.controller')

module.exports = app => {
  app.get('/api/v1/auth/github', authGithubController.hello);
  app.get('/pr-update', webSocketController.test);
};
