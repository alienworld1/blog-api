const router = require('express').Router();

const postController = require('../controllers/post');

router.get('/', postController.get_all_posts);
router.get('/public', postController.get_all_public_posts);
router.get('/private', postController.get_all_private_posts);

router.get('/:postid', postController.get_post_by_id);

router.post('/', postController.create_post);

router.put('/:postid', postController.update_post);

router.delete('/:postid', postController.delete_post);

module.exports = router;
