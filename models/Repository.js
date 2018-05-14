const mongoose = require('mongoose');
const { Schema } = mongoose;

const repositorySchema = new Schema({
  githubId: { type: String, required: true },
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  private: { type: Boolean, required: true },
  webUrl: { type: String, required: true },
  apiUrl: { type: String, required: true },
  hookUrl: { type: String, required: true },
  hookId: { type: String },
  pullUrl: { type: String, required: true },
  description: { type: String },
  language: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'users' },
  hookEnabled: { type: Boolean, default: true },
  color: { type: String, default: '#0bd8be' },
  _pullRequests: [
    {
      _id: false,
      pullRequest: { type: Schema.Types.ObjectId, ref: 'pullrequests' },
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  synced_at: { type: Date, default: Date.now },
});

mongoose.model('repositories', repositorySchema);
