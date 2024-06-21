const router = require('express').Router();

const userController = require('../controllers/user');

router.get('/', userController.get_all_users);
router.get('/:userid', userController.get_user_by_id);

router.post('/', userController.create_user);
router.delete('/:userid', userController.delete_user);

module.exports = router;
