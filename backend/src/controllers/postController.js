const Post = require('../models/Post');
const AuditLog = require('../models/AuditLog');
const sendEmail = require('../utils/email');
const User = require('../models/User');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public/Private
const getPosts = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category ? { categoryId: req.query.category } : {};

  let query = { ...keyword, ...category };

  // Check for specific author request
  if (req.query.authorId) {
    query.authorId = req.query.authorId;
  }

  const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');
  const isOwnPosts = req.user && req.query.authorId && req.user._id.toString() === req.query.authorId;

  if (isAdmin) {
    // Admin sees all, but can filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
  } else if (isOwnPosts) {
    // User viewing their own posts can see all statuses
    if (req.query.status) {
      query.status = req.query.status;
    }
  } else {
    // Public feed or viewing another user's posts: ONLY published
    query.status = 'published';
  }

  const count = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .populate('authorId', 'name')
    .populate('categoryId', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ posts, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public/Private
const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('authorId', 'name')
    .populate('categoryId', 'name')
    .populate('comments.user', 'name');

  if (post) {
    // Check visibility
    if (
      post.status === 'published' ||
      (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) ||
      (req.user && req.user._id.toString() === post.authorId._id.toString())
    ) {
      // Increment views
      post.views = (post.views || 0) + 1;
      await post.save();
      
      res.json(post);
    } else {
      res.status(404);
      throw new Error('Post not found or not authorized to view');
    }
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  const { title, content, categoryId } = req.body;

  const post = new Post({
    title,
    content,
    categoryId,
    authorId: req.user._id,
    status: 'pending',
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  const { title, content, categoryId } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    if (post.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      res.status(401);
      throw new Error('Not authorized to update this post');
    }

    if (post.status === 'published' && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        res.status(400);
        throw new Error('Cannot edit published post');
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.categoryId = categoryId || post.categoryId;
    
    if (post.status === 'rejected') {
        post.status = 'pending';
        post.rejectReason = undefined;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    if (post.authorId.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      res.status(401);
      throw new Error('Not authorized to delete this post');
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
};

// @desc    Approve post
// @route   POST /api/posts/:id/approve
// @access  Private/Admin
const approvePost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('authorId');

  if (post) {
    post.status = 'published';
    post.publishedAt = Date.now();
    post.adminId = req.user._id;
    post.rejectReason = undefined;

    await post.save();

    // Audit Log
    await AuditLog.create({
      adminId: req.user._id,
      action: 'approve_post',
      targetId: post._id,
      targetModel: 'Post',
    });

    // Send email
    const message = `Your post "${post.title}" has been approved and is now published.`;
    const html = `
      <h1>Post Approved</h1>
      <p>Your post "<strong>${post.title}</strong>" has been approved and is now published.</p>
    `;

    await sendEmail({
      email: post.authorId.email,
      subject: 'kbase - Post Approved',
      message,
      html,
    });

    res.json({ message: 'Post approved' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
};

// @desc    Reject post
// @route   POST /api/posts/:id/reject
// @access  Private/Admin
const rejectPost = async (req, res) => {
  const { reason } = req.body;
  const post = await Post.findById(req.params.id).populate('authorId');

  if (post) {
    post.status = 'rejected';
    post.adminId = req.user._id;
    post.rejectReason = reason;

    await post.save();

    // Audit Log
    await AuditLog.create({
      adminId: req.user._id,
      action: 'reject_post',
      targetId: post._id,
      targetModel: 'Post',
      details: { reason },
    });

    // Send email
    const message = `Your post "${post.title}" has been rejected.\nReason: ${reason}`;
    const html = `
      <h1>Post Rejected</h1>
      <p>Your post "<strong>${post.title}</strong>" has been rejected.</p>
      <p><strong>Reason:</strong> ${reason}</p>
    `;

    await sendEmail({
      email: post.authorId.email,
      subject: 'kbase - Post Rejected',
      message,
      html,
    });

    res.json({ message: 'Post rejected' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    if (post.likes.includes(req.user._id)) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      // Like
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json(post.likes);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
};

// @desc    Add a comment
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
  const { text } = req.body;
  const post = await Post.findById(req.params.id);

  if (post) {
    const comment = {
      user: req.user._id,
      text,
    };

    post.comments.push(comment);
    await post.save();
    
    // Populate user info for the new comment
    const updatedPost = await Post.findById(req.params.id).populate('comments.user', 'name');
    const newComment = updatedPost.comments[updatedPost.comments.length - 1];

    res.status(201).json(newComment);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  approvePost,
  rejectPost,
  likePost,
  addComment,
  deletePost,
  approvePost,
  rejectPost,
};
