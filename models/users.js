const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  postings: {
    type: [mongoose.Schema.Types.ObjectId], // Assuming postings are referenced by their ObjectId
    default: [],
  },
  liked: {
    type: [mongoose.Schema.Types.ObjectId], // Assuming liked posts are referenced by their ObjectId
    default: [],
  },
  interested: {
    type: [mongoose.Schema.Types.ObjectId], // Assuming interested posts are referenced by their ObjectId
    default: [],
  },
  firebase_id: {
    type: String,
    required: true,
    unique: true,
  },

}, { versionKey: false });

// Export the Mongoose model
module.exports = mongoose.model('users', userSchema);
