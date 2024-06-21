const router = require('express').Router();

const commentController = require('../controllers/comment');

router.get('/', commentController.get_comments_in_post);
router.get('/:commentid', commentController.get_comment_by_id);

router.post('/', commentController.create_comment);

router.put('/:commentid', commentController.update_comment);
router.delete('/:commentid', commentController.delete_comment);

module.exports = router;
