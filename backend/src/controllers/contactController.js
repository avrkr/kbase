const Contact = require('../models/Contact');
const sendEmail = require('../utils/email');

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please provide all fields');
  }

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  // Send email to admin
  const emailMessage = `
    You have received a new contact form submission:
    
    Name: ${name}
    Email: ${email}
    Subject: ${subject}
    
    Message:
    ${message}
  `;
  
  const html = `
    <h1>New Contact Form Submission</h1>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <br/>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;

  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL;
    
    await sendEmail({
      email: adminEmail,
      subject: `Contact Form: ${subject}`,
      message: emailMessage,
      html: html
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    // We don't fail the request if email fails, as we saved it to DB
  }

  res.status(201).json(contact);
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  res.json(contacts);
};

// @desc    Reply to a contact message
// @route   POST /api/contact/:id/reply
// @access  Private/Admin
const replyContact = async (req, res) => {
  const { message } = req.body;
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Contact message not found');
  }

  if (!message) {
    res.status(400);
    throw new Error('Please provide a reply message');
  }

  // Send email to user
  const emailMessage = `
    Dear ${contact.name},

    ${message}

    Best regards,
    The Team
  `;

  try {
    await sendEmail({
      email: contact.email,
      subject: `Re: ${contact.subject}`,
      message: emailMessage,
    });

    contact.status = 'replied';
    contact.reply = {
      message,
      repliedAt: Date.now(),
    };
    await contact.save();

    res.json({ message: 'Reply sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Email could not be sent');
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Contact message not found');
  }

  await contact.deleteOne();
  res.json({ message: 'Contact message removed' });
};

module.exports = {
  submitContact,
  getContacts,
  replyContact,
  deleteContact,
};
