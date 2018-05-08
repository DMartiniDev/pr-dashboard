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
