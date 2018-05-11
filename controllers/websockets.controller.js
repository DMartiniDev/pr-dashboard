const { io } = require('../setupServer.js');

module.exports.test = (req, res) => {
  io.emit('pr-update', [
    {
      "_id": "5af0778b2bf32a1ebf79c56f",
      "repository": {
        "_id": "5af0778b2bf32a1ebf79c56d",
        "name": "test",
        "fullName": "g0g11/test",
        "private": false,
        "webUrl": "https://github.com/g0g11/test",
        "description": "Test repository"
      },
      "user": {
        "loginName": "g0g11",
        "picture": "https://avatars2.githubusercontent.com/u/16637843?v=4",
        "webUrl": "https://github.com/g0g11"
      },
      "closed_at": null,
      "merged_at": null,
      "created_at": "2018-05-07T12:43:35.000Z",
      "updated_at": "2018-05-07T12:43:35.000Z",
      "action": "opened",
      "number": "5",
      "webUrl": "https://github.com/g0g11/test/pull/5",
      "state": "open",
      "title": "Final version authentication",
      "review": true,
      "comment": "Please review my code!",
      "comments": "2"
    },
    {
      "_id": "5af0778b2bf32a1ebf79c588",
      "repository": {
        "_id": "5af0778b2bf32a1ebf79c56d",
        "name": "test",
        "fullName": "g0g11/test",
        "private": false,
        "webUrl": "https://github.com/g0g11/test",
        "description": "Test repository"
      },
      "user": {
        "loginName": "g0g11",
        "picture": "https://avatars2.githubusercontent.com/u/16637843?v=4",
        "webUrl": "https://github.com/g0g11"
      },
      "closed_at": null,
      "merged_at": null,
      "created_at": "2018-05-07T12:43:35.000Z",
      "updated_at": "2018-05-07T12:43:35.000Z",
      "action": "open",
      "number": "12",
      "webUrl": "https://github.com/g0g11/test/pull/12",
      "state": "opened",
      "title": "Refactor Code",
      "review": false,
      "comment": "User Controller code improved!",
      "comments": "12"
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