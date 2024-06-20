const mongoose = require('mongoose');

const Comment = require('./comment');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
   },
  body: {type: String, required: true},
  isPublic: {type: Boolean, default: true},
  timestamp: {type: Date, required: true},
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
});

postSchema.pre('findOneAndDelete', async function (next) {
  try {
    await Comment.deleteMany({_id: {$in: this.comments}});
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Post', postSchema);
