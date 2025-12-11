const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  visibleFrom: {
    type: Date,
  },
  visibleTo: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
