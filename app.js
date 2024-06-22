const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const User = require('./models/user');

const indexRouter = require('./routes/index');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL)
  .catch(err => console.error(err));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
   },
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
    collectionName: 'sessions',
  }),
}));

app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username }).exec();

      if (!user) {
        return done(null, false, {message: 'This user does not exist'});
      }

      const verifyPassword = await bcrypt.compare(password, user.password);

      if (!verifyPassword) {
        return done(null, false, {message: 'The password is incorrect.'});
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

require('./config/jwt');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api', indexRouter);

app.use((req, res, next) => next(createError(404)));

app.use((err, req, res, next) => {
  const error = req.app.get('env') === 'development' ? err: {};
  const status = err.status || 500;
  res.status(status).json({
    status,
    message: err.message,
    error: err,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));
