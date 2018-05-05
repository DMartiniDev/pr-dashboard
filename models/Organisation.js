const mongoose = require('mongoose');
const { Schema } = mongoose;

const organisationSchema = new Schema({
  githubId: { String, required: true },
  login: { String, required: true },
  apiUrl: { String, required: true },
  hookUrl: { String, required: true },
  picture: { String },
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
