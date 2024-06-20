const router = require('express').Router();
const postRouter = require('./post');

router.get('/', (req, res) => {
  res.json({
    message: 'Request a resource',
  });
});

router.use('/posts', postRouter);

module.exports = router;
