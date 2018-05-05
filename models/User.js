const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  githubId: { type: String },
  loginName: { type: String, required: true, lowercase: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  picture: { type: String },
  apiUrl: { type: String },
  webUrl: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  _repositories: [
    {
      hookEnabled: { type: Boolean },
      repository: { type: Schema.Types.ObjectId, ref: 'repositories' },
    },
  ],
  _organisations: [
    {
      isAdmin: { type: Boolean },
      hookEnabled: { type: Boolean },
      organization: { type: Schema.Types.ObjectId, ref: 'organisations' },
    },
  ],
});

mongoose.model('users', userSchema);
