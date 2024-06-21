const router = require('express').Router();

const postController = require('../controllers/post');
const commentController = require('../controllers/comment');

router.get('/', postController.get_all_posts);
router.get('/public', postController.get_all_public_posts);
router.get('/private', postController.get_all_private_posts);

router.get('/:postid', postController.get_post_by_id);

router.post('/', postController.create_post);

router.put('/:postid', postController.update_post);

router.delete('/:postid', postController.delete_post);

router.get('/:postid/comments', commentController.get_comments_in_post);
router.get('/comments/:commentid', commentController.get_comment_by_id);

router.post('/:postid/comments', commentController.create_comment);

router.put('/comments/:commentid', commentController.update_comment);
router.delete('/comments/:commentid', commentController.delete_comment);

module.exports = router;
