const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {type: String, required: true},
  body: {type: String, required: true},
  isPublic: {type: Boolean, default: true},
  timestamp: {type: Date, required: true},
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
});

module.exports = mongoose.model('Post', postSchema);
