const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  githubId: String,
  firstName: String,
  lastName: String,
  email: String,
  picture: String,
});

mongoose.model('users', userSchema);
