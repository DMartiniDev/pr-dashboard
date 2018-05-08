const { io } = require('../setupServer.js');

module.exports.test = (req, res) => {
  io.emit('pr-update', [
    {
        "_id": "1234987655",
        "repository": {
            "_id": "5567894321",
            "name": "Cool Project",
            "fullName": "randomUser/brand-new-repo",
            "private": false,
            "webUrl": "https://github.com/randomUser/brand-new-repo",
            "description": "This is a brand new repository"
        },
        "user": {
            "loginName": "randomUser",
            "picture": "https://avatars0.githubusercontent.com/u/63034?s=400&v=4sss",
            "webUrl": "https://github.com/randomUser"
        },
        "closed_at": null,
        "merged_at": null,
        "created_at": "1999-05-07T12:43:35.000Z",
        "updated_at": "1999-05-07T12:43:35.000Z",
        "action": "opened",
        "number": "5",
        "webUrl": "https://github.com/randomUser/brand-new-repo/pull/5",
        "state": "open",
        "title": "Shiny new pull request!",
        "comment": "Please review my code!",
        "comments": "1"
    },{
      "_id": "abcde4321edcba1234",
      "repository": {
          "_id": "4321abcde1234edcba",
          "name": "Custom Management App",
          "fullName": "yetAnotherCitizen/management-app",
          "private": false,
          "webUrl": "https://github.com/yetAnotherCitizen/management-app",
          "description": "Management done right"
      },
      "user": {
          "loginName": "yetAnotherCitizen",
          "picture": "https://avatars2.githubusercontent.com/u/27972790?s=400&v=4",
          "webUrl": "https://github.com/yetAnotherCitizen"
      },
      "closed_at": null,
      "merged_at": null,
      "created_at": "2002-02-07T12:43:35.000Z",
      "updated_at": "2002-02-07T12:43:35.000Z",
      "action": "opened",
      "number": "1",
      "webUrl": "https://github.com/yetAnotherCitizen/management-app/pull/1",
      "state": "open",
      "title": "Authentication",
      "comment": "Implement authentication for the platform",
      "comments": "1"
    }
  ]);

  res.status(200).send('Updated data for PRs has been sent');
};

module.exports.reposUpdate = (req, res) => {
    io.emit('repos-update', [
        {
            "_id": "5af0778b2bf32a1ebf79c56a",
            "name": "pr-dashboard",
            "fullName": "dkm-coder/pr-dashboard",
            "private": true,
            "webUrl": "https://github.com/dkm-coder/pr-dashboard",
            "hookEnabled": false,
            "description": "Github Pull Request Dashboard"
        },
        {
            "_id": "123456789098765432123456",
            "name": "pr-dashboard-client",
            "fullName": "carrmelo/pr-dashboard-client",
            "private": false,
            "webUrl": "https://github.com/carrmelo/pr-dashboard-client",
            "hookEnabled": true,
            "description": "Client for PR Dashboard"
        }
    ]);
    res.status(200).send('Updated data for repositories has been sent');
};