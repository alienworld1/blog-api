const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const indexRouter = require('./routes/index');

const app = express();

mongoose.connect(process.env.MONGODB_URL)
  .catch(err => console.error(err));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api', indexRouter);

app.use((req, res, next) => next(createError(404)));

app.use((err, req, res, next) => {
  const error = req.app.get('env') === 'development' ? err: {};
  res.json({
    status: err.status || 500,
    message: err.message,
    error: err,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));
