const mongoose = require('mongoose');
const { Schema } = mongoose;

const pullrequestSchema = new Schema({
  githubId: { type: String, required: true, unique: true },
  action: { type: String, required: true },
  number: { type: String, required: true },
  webUrl: { type: String, required: true },
  apiUrl: { type: String, required: true },
  state: { type: String, required: true },
  title: { type: String },
  comment: { type: String },
  comments: { type: String },
  user: {
    githubId: { type: String },
    loginName: { type: String, required: true, lowercase: true },
    picture: { type: String },
    apiUrl: { type: String },
    webUrl: { type: String },
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  closed_at: { type: Date, default: null },
  merged_at: { type: Date, default: null },
});

mongoose.model('pullrequests', pullrequestSchema);
