const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  body: {type: String, required: true},
  timestamp: {type: Date, required: true},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Comment', commentSchema);
