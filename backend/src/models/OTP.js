const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  otpHash: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['forgot_password'],
    default: 'forgot_password',
  },
  used: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
