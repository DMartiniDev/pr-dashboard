const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  githubId: { type: String },
  loginName: { type: String, required: true, lowercase: true },
  displayName: { type: String },
  email: { type: String, lowercase: true },
  picture: { type: String },
  apiUrl: { type: String },
  webUrl: { type: String },
  permissions: {
    public: { type: Boolean, default: true },
    private: { type: Boolean, default: false },
    org: { type: Boolean, default: false },
  },
  accessToken: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  _repositories: [
    {
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
