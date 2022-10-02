const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ['Client'],
  },
  active: {
    type: Boolean,
    default: true,
  },
  limit: {
    type: Number,
    default: 2100,
  },
});

module.exports = mongoose.model('User', userSchema);
