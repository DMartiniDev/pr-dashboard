const authGithubController = require('../controllers/auth.github.controller');

module.exports = app => {
  app.get('/api/v1/auth/github', authGithubController.hello);
};
