const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  replyContact,
  deleteContact,
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(submitContact).get(protect, admin, getContacts);
router.route('/:id').delete(protect, admin, deleteContact);
router.route('/:id/reply').post(protect, admin, replyContact);

module.exports = router;
