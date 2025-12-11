const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'rejected'],
    default: 'pending',
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rejectReason: {
    type: String,
  },
  publishedAt: {
    type: Date,
  },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
