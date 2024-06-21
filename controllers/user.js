const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.get_all_users = asyncHandler(async (req, res, next) => {
  const users = await User.find().exec();
  res.json(users ?? []);
});

exports.get_user_by_id = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userid).exec();

  if (user === null) {
    res.status(404).json({message: 'User not found'});
  } else {
    res.json(user);
  }
  
});

exports.create_user = [
  body('username')
    .trim()
    .isLength({min: 3, max: 32})
    .withMessage('Username must be between 3-32 characters')
    .isAlphanumeric()
    .withMessage('Username must not contain any special characters'),
  body('password')
    .isLength({min: 6, max: 32})
    .withMessage('Password must be between 6-32 characters'),
  body('isAuthor')
    .isBoolean()
    .toBoolean(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      username: req.body.username,
      password: req.body.password,
      isAuthor: req.body.isAuthor,
    });
    
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
      return;
    }

    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    res.json(user);
  }),
];

exports.delete_user = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userid).exec();

  if (user === null) {
    res.status(404).json({message: 'User not found'});
  } else {
    await User.findByIdAndDelete(user.id).exec();
    res.json({message: 'User deleted successfully'});
  }
});
