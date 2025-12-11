const User = require('../models/User');
const OTP = require('../models/OTP');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/email');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  const { name, email } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const password = crypto.randomBytes(8).toString('hex');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role: 'user',
  });

  if (user) {
    // Send email with credentials
    const message = `Welcome to kbase! Your account has been created.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login and change your password immediately.`;
    const html = `
      <h1>Welcome to kbase</h1>
      <p>Your account has been created.</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>Please login and change your password immediately.</p>
      <br/>
      <p>kbase Team</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to kbase - Your Account Details',
        message,
        html,
      });
    } catch (error) {
      console.error(error);
      // Don't fail registration if email fails, but log it
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isActive) {
      res.status(401);
      throw new Error('User account is deactivated');
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt(10);
  const otpHash = await bcrypt.hash(otp, salt);

  // Expires in 10 minutes
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OTP.create({
    userId: user._id,
    otpHash,
    expiresAt,
    purpose: 'forgot_password',
  });

  const message = `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`;
  const html = `
    <h1>Password Reset</h1>
    <p>Your OTP for password reset is: <strong>${otp}</strong></p>
    <p>It expires in 10 minutes.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'kbase - Password Reset OTP',
      message,
      html,
    });
    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500);
    throw new Error('Email could not be sent');
  }
};

// @desc    Verify OTP and reset password
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const validOtp = await OTP.findOne({
    userId: user._id,
    purpose: 'forgot_password',
    used: false,
    expiresAt: { $gt: Date.now() },
  }).sort({ createdAt: -1 });

  if (!validOtp) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  const isMatch = await bcrypt.compare(otp, validOtp.otpHash);

  if (!isMatch) {
    res.status(400);
    throw new Error('Invalid OTP');
  }

  // Mark OTP as used
  validOtp.used = true;
  await validOtp.save();

  // Generate temp password
  const tempPassword = crypto.randomBytes(8).toString('hex');
  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(tempPassword, salt);
  await user.save();

  const message = `Your new temporary password is: ${tempPassword}. Please change it after logging in.`;
  const html = `
    <h1>Password Reset Successful</h1>
    <p>Your new temporary password is: <strong>${tempPassword}</strong></p>
    <p>Please change it after logging in.</p>
  `;

  await sendEmail({
    email: user.email,
    subject: 'kbase - New Temporary Password',
    message,
    html,
  });

  res.json({ message: 'Password reset successful. Check email for new password.' });
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (user && (await user.matchPassword(oldPassword))) {
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } else {
    res.status(401);
    throw new Error('Invalid old password');
  }
};

module.exports = {
  registerUser,
  authUser,
  forgotPassword,
  verifyOtp,
  changePassword,
};
