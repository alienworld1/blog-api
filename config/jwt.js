const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  const user = await User.findById(jwt_payload.sub);
  if (err) {
    return done(err, false);
  }

  if (user) {
    return done(null, user);
  } else {
    return done(null, false);
  }
}));

module.exports = passport;
