const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Post = require('../models/post');

exports.get_all_posts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().sort({timestamp: -1}).exec();
  res.send(posts ?? {});
});

exports.get_all_public_posts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({isPublic: true}).sort({timestamp: -1}).exec();
  res.send(posts ?? {});
});

exports.get_all_private_posts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({isPublic: false}).sort({timestamp: -1}).exec();
  res.send(posts ?? {});
});

exports.get_post_by_id = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postid).exec();

  if (post === null) {
    res.status(404).send({
      message: 'Post not found',
    });
    return;
  }

  res.send(post);
});

exports.create_post = [
  body('title', 'Title must be between 1 - 50 characters.')
    .trim()
    .isLength({min: 1, max: 50})
    .escape(),
  body('body', 'The body of the post must be between 1 - 10000 characters.')
    .trim()
    .isLength({min: 1, max: 10000})
    .escape(),
  body('isPublic', 'isPublic should be a boolean')
    .isBoolean()
    .toBoolean(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const post = new Post({
      title: req.body.title,
      body: req.body.body,
      isPublic: req.body.isPublic,
      timestamp: new Date(),
      comments: [], 
    });

    if (!errors.isEmpty()) {
      res.status(400).send(errors.array());
    } else {
      await post.save();
      res.send(post);
    }
  }),
];

exports.update_post = [
  body('title', 'Title must be between 1 - 50 characters.')
    .trim()
    .isLength({min: 1, max: 50})
    .escape(),
  body('body', 'The body of the post must be between 1 - 10000 characters.')
    .trim()
    .isLength({min: 1, max: 10000})
    .escape(),
  body('isPublic', 'isPublic should be a boolean')
    .isBoolean()
    .toBoolean(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const post = await Post.findById(req.params.postid).exec();
    
    if (post === null) {
      res.status(404).send({
        message: 'Post not found',
      });
      return;
    }

    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
      isPublic: req.body.isPublic,
      timestamp: new Date(),
      comments: post.comments, 
      _id: req.params.postid, 
    });

    if (!errors.isEmpty()) {
      res.status(400).send(errors.array());
    } else {
      await newPost.save();
      res.send(newPost);
    }
  }),
];

exports.delete_post = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postid).exec();

  if (post === null) {
    res.status(404).send({message: 'Post not found'});
    return;
  }

  await Post.findByIdAndDelete(req.params.postid).exec();
  res.send({
    message: 'Post has been deleted.'
  });
});
