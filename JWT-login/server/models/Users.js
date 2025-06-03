// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  role:         {
    type: String,
    enum: ['admin', 'manager', 'editor', 'user', 'guest'],
    default: 'user'
  },
  refreshToken: { type: String } // (optional, if you want refresh logic later)
});

module.exports = mongoose.model('User', UserSchema);
