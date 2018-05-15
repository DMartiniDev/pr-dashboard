const { io } = require('../setupServer.js');

module.exports.test = (req, res) => {
  pulls = [
    {
      "_id": "5af0778b2bf32a1ebf79c56f",
      "repository": {
        "_id": "5af0778b2bf32a1ebf79c56d",
        "name": "test",
        "fullName": "g0g11/test",
        "private": false,
        "webUrl": "https://github.com/g0g11/test",
        "description": "One cool repo"
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
      "title": "A brand new pull request",
      "review": true,
      "comment": "Look at me!",
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
      "title": "Something new",
      "review": false,
      "comment": "A random comment",
      "comments": "12"
    }
  ];

  // Send data to the client
  io.emit('message', {
    type: 'pull_request',
    payload: pulls
  });

  res.status(200).send('Updated data for PRs has been sent');
};

module.exports.reposUpdate = (req, res) => {
  repos = [
    {
      "_id": "5af0778b2bf32a1ebf79c56a",
      "name": "pr-dashboard",
      "fullName": "dkm-coder/pr-dashboard",
      "private": false,
      "language": "JavaScript",
      "webUrl": "https://github.com/dkm-coder/pr-dashboard",
      "description": "Github Pull Request Dashboard",
      "hookEnabled": true,
      "color": "#c2c2c2"
    },
    {
      "_id": "5af0778b2bf32a1ebf79c56b",
      "name": "go-for-eat",
      "fullName": "g0g11/go-for-eat-client",
      "private": false,
      "language": "Python",
      "webUrl": "https://github.com/g0g11/go-for-eat-client",
      "description": "Go4Eat Client",
      "hookEnabled": false,
      "color": "#d1d2d3"
    }
  ];

  // Send data to the client
  io.emit('message', {
    type: 'repos-update',
    payload: repos
  });

  res.status(200).send('Updated data for repositories has been sent');
};