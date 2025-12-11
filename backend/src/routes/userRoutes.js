const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAdmins,
  createAdmin,
  contactSupport,
} = require('../controllers/userController');
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getUsers).post(protect, admin, createUser);
router.post('/contact', contactSupport);
router.route('/admins').get(protect, superAdmin, getAdmins).post(protect, superAdmin, createAdmin);
router
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
