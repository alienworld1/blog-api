const router = require('express').Router();
const postRouter = require('./post');
const userRouter = require('./user');
const authRouter = require('./auth');

router.get('/', (req, res) => {
  res.json({
    message: 'Request a resource',
  });
});

router.use('/posts', postRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);

module.exports = router;
