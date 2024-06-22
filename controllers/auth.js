const passport = require('passport');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_login_post = (req, res, next) => {
  passport.authenticate('local', {session: true}, (err, user, info) => {
    if (err) {
      const error = new Error('An error occured during authentication');
      error.status = 500;
      return next(error);
    }
  
    if (!user) {
      const error = new Error(info.message || 'Authentication failed');
      error.status = 401;
      return next(error);
    }
  
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }

      return res.json({message: 'Log in successful', user: req.user});
    });
  })(req, res, next);
};

exports.user_logout = (req, res, next) => {
  req.logout(err => {
    if (err) {
      const error = new Error('Error logging out');
      error.status = 500;
      return next(error);
    }

    res.json({message: 'Logged out successfully'}); 
  })
}

exports.admin_login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username }).exec();

  if (!user) {
    return res.status(401).json({message: 'Username not found'});
  }

  if (user.username != process.env.ADMIN_USERNAME) {
    return res.status(403).json({message: 'This user is not authorized to view this resource.'});
  }

  const verifyPassword = await bcrypt.hash(req.body.password, user.password);

  if (!verifyPassword) {
    return res.status(401).json({message: 'Incorrect password.'});
  }

  const payload = { id: user.id, username: user.username };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ message: 'Authentication successful', token: `Bearer ${token}`});
}); 
