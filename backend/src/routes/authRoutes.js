const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  forgotPassword,
  verifyOtp,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', authUser);
router.post('/forgot', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/change-password', protect, changePassword);

module.exports = router;
