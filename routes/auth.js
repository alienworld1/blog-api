const router = require('express').Router();

const authController = require('../controllers/auth');
const { userIsLoggedIn, userIsAdmin } = require('../middleware/auth');


router.post('/log-in', authController.user_login_post);
router.get('/log-out', userIsLoggedIn, authController.user_logout);

router.post('/admin/log-in', authController.admin_login);
// Admin logout will be handled by the client

module.exports = router;
