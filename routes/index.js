const router = require('express').Router();
const postRouter = require('./post');
const userRouter = require('./user');

router.get('/', (req, res) => {
  res.json({
    message: 'Request a resource',
  });
});

router.use('/posts', postRouter);
router.use('/users', userRouter);

module.exports = router;
