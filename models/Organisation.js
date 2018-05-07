const mongoose = require('mongoose');
const { Schema } = mongoose;

const organisationSchema = new Schema({
  githubId: { type: String, required: true },
  login: { type: String, required: true },
  apiUrl: { type: String, required: true },
  hookUrl: { type: String, required: true },
  picture: { type: String },
  _repositories: [
    {
      hookEnabled: { type: Boolean },
      repository: { type: Schema.Types.ObjectId, ref: 'repositories' },
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

mongoose.model('organisations', organisationSchema);
