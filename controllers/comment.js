const asyncHandler = require('express-async-handler');

const { body, validationResult } = require('express-validator');

const Comment = require('../models/comment');
const Post = require('../models/post');

exports.get_comments_in_post = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postid).exec();

  if (post === null) {
    res.status(404).send({message: 'Post not found'});
    return;
  }

  const { comments } = post;

  res.send(comments);
});

const get_comment_by_id = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentid).exec();

  if (comment === null) {
    res.status(404).send({message: 'Comment not found'});
    return;
  }

  res.send(comment);
});

exports.create_comment = [
  body('body', 'The comment must be between 1-280 characters.')
    .trim()
    .isLength({min: 1, max: 280})
    .escape(),
  body('author', 'An author must be specified')
    .exists(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const post = await Post.findById(req.params.id).exec();

    if (post === null) {
      res.status(404).send({message: 'Post not found'});
      return;
    }

    const comment = new Comment({
      body: req.body.body,
      author: req.body.author,
      timestamp: new Date(),
    });

    if (!errors.isEmpty()) {
      res.status(400).send(errors.array());
      return;
    }

    await comment.save();
    await Post.findByIdAndUpdate(post.id, {
      comments: [...post.comments, comment.id],
    });

    res.send(comment);
  }),
];

exports.update_comment = [
  body('body', 'The comment must be between 1-280 characters.')
    .trim()
    .isLength({min: 1, max: 280})
    .escape(),
  body('author', 'An author must be specified')
    .exists(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const comment = await Comment.findById(req.params.commentid);

    if (comment === null) {
      res.status(404).send({message: 'Comment not found'});
      return;
    }

    const newComment = new Comment({
      _id: comment.id,
      body: req.body.body,
      author: req.body.author,
      timestamp: new Date(),
    });

    if (!errors.isEmpty()) {
      res.status(400).send(errors.array());
      return;
    }

    const updatedComment = await Comment.findByIdAndUpdate(comment.id, newComment).exec();
    res.send(updatedComment);
  }),
];

exports.delete_comment = asyncHandler(async(req, res, next) => {
  const comment = Comment.findById(req.params.commentid).exec();

  if (comment === null) {
    res.status(404).send({message: 'Comment not found'});
    return;
  }

  await Comment.findByIdAndDelete(comment.id).exec();

  res.send({message: 'The comment has been deleted'});
});
