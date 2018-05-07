require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  githubSecret: process.env.GITHUB_SECRET,
};
