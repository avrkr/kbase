const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  approvePost,
  rejectPost,
  likePost,
  addComment,
} = require('../controllers/postController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getPosts).post(protect, createPost); // getPosts handles public/private logic inside
router.route('/:id').get(protect, getPostById).put(protect, updatePost).delete(protect, deletePost);
router.route('/:id/approve').post(protect, admin, approvePost);
router.route('/:id/reject').post(protect, admin, rejectPost);
router.route('/:id/like').post(protect, likePost);
router.route('/:id/comment').post(protect, addComment);

module.exports = router;
