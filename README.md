# Pull Request Dashboard

## Usage

#### Development Environment
* Make sure you have an instance of [MongoDB](https://www.mongodb.com/) running or use a external Mongo Database Provider.
* Clone the repository with ``git clone <repository url>``
* Install the dependencies ``yarn install``
* Create a ``.env`` file in the root folder with the required keys. You can find an example in ``.env.example``.
* To fetch all initial information from GitHub execute ``node ./bin/cronjob.js``
 
#### Deploy to Heroku
To deploy the Pull Request Dashboard to Heroku, follow the following steps:
* Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line)
* Change to project directory and be sure to login with your Heroku credentials ``heroku login``
* Add the Heroku Remote Repository to your git config ``heroku git:remote -a pr-dashboard-server``
* Push the repository to Heroku ``git push heroku master``
* Add Config variables on Heroku. Select Project > Settings > Config Vars. You can compare the config variables with .env.example.

## API
To use the API, you can check the documentation [here](https://prdashboard1.docs.apiary.io/).

## Tech Stack
* [Node JS](https://nodejs.org/en/)
* [Express JS](http://expressjs.com/)
* [Mongoose](http://mongoosejs.com/)

## Team
Carmelo Carrillo - [GitHub](https://github.com/carrmelo)

Dave Martínez - [GitHub](https://github.com/dkm-coder)

José Manuel - [GitHub](https://github.com/limitlessgenius)

Goran Plavsic - [GitHub](https://github.com/g0g11)
