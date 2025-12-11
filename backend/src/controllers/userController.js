const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const getEmailTemplate = require('../utils/emailTemplate');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const count = await User.countDocuments({});
  const users = await User.find({})
    .select('-passwordHash')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ users, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Create user (Admin)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
  const { name, email, role } = req.body;

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
    role: role || 'user',
  });

  if (user) {
    const htmlContent = `
      <p>Your account has been created by an admin.</p>
      
      <div class="info-box">
        <div class="label">Email Address</div>
        <div class="value">${email}</div>
        <br>
        <div class="label">Password</div>
        <div class="value">${password}</div>
      </div>
      
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" class="button">Login to Dashboard</a>
    `;

    const html = getEmailTemplate('Account Created', htmlContent);

    await sendEmail({
      email: user.email,
      subject: 'kbase - Account Created',
      html,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Get all admins
// @route   GET /api/admins
// @access  Private/SuperAdmin
const getAdmins = async (req, res) => {
  const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } }).select('-passwordHash');
  res.json(admins);
};

// @desc    Create admin
// @route   POST /api/admins
// @access  Private/SuperAdmin
const createAdmin = async (req, res) => {
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
    role: 'admin',
  });

  if (user) {
    const message = `Welcome to kbase! Your account has been created.\n\nEmail: ${email}\nPassword: ${password}`;
    
    const htmlContent = `
      <p>Welcome to kbase! Your account has been successfully created.</p>
      <p>Here are your login credentials:</p>
      
      <div class="info-box">
        <div class="label">Email Address</div>
        <div class="value">${email}</div>
        <br>
        <div class="label">Password</div>
        <div class="value">${password}</div>
      </div>
      
      <p>You can now log in to your dashboard using these credentials.</p>
      
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" class="button">Login to Dashboard</a>
    `;

    const html = getEmailTemplate('Welcome to kbase', htmlContent);

    await sendEmail({
      email: user.email,
      subject: 'Welcome to kbase - Your Account Details',
      message,
      html,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Send contact email
// @route   POST /api/users/contact
// @access  Public
const contactSupport = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please provide all fields');
  }

  const emailMessage = `
    You have received a new contact form submission:
    
    Name: ${name}
    Email: ${email}
    Subject: ${subject}
    
    Message:
    ${message}
  `;
  
  const htmlContent = `
    <p>You have received a new message from the contact form.</p>
    
    <div class="info-box">
      <div class="label">From</div>
      <div class="value">${name} (${email})</div>
      <br>
      <div class="label">Subject</div>
      <div class="value">${subject}</div>
    </div>
    
    <p><strong>Message:</strong></p>
    <p style="background-color: #f1f5f9; padding: 16px; border-radius: 8px;">${message.replace(/\n/g, '<br>')}</p>
  `;

  const html = getEmailTemplate('New Contact Message', htmlContent);

  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL;
    
    await sendEmail({
      email: adminEmail,
      subject: `Contact Form: ${subject}`,
      message: emailMessage,
      html: html
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Email could not be sent');
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAdmins,
  createAdmin,
  contactSupport,
};
