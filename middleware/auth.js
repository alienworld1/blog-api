const passport = require('passport');

exports.userIsLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    const error = new Error('The user is not authenticated');
    error.status = 401;
    return next(error);
  }
};

exports.userIsAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({message: 'Unauthorized'});
    }

    req.user = user;
    return next();
  })(req, res, next);
};
