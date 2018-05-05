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
  pullUrl: { type: String, required: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

mongoose.model('repositories', repositorySchema);
