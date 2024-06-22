const router = require('express').Router();

const authController = require('../controllers/auth');

router.post('/log-in', authController.user_login_post);
router.get('/log-out', authController.user_logout);

module.exports = router;
