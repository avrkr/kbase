const Banner = require('../models/Banner');

// @desc    Get active banners
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res) => {
  const now = new Date();
  const banners = await Banner.find({
    isActive: true,
    $or: [
      { visibleFrom: { $lte: now }, visibleTo: { $gte: now } },
      { visibleFrom: { $lte: now }, visibleTo: null },
      { visibleFrom: null, visibleTo: { $gte: now } },
      { visibleFrom: null, visibleTo: null },
    ],
  });
  res.json(banners);
};

// @desc    Create banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
  const { title, content, link, visibleFrom, visibleTo } = req.body;

  const banner = await Banner.create({
    title,
    content,
    link,
    visibleFrom,
    visibleTo,
    createdBy: req.user._id,
  });

  res.status(201).json(banner);
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (banner) {
    banner.title = req.body.title || banner.title;
    banner.content = req.body.content || banner.content;
    banner.link = req.body.link || banner.link;
    banner.isActive = req.body.isActive !== undefined ? req.body.isActive : banner.isActive;
    banner.visibleFrom = req.body.visibleFrom || banner.visibleFrom;
    banner.visibleTo = req.body.visibleTo || banner.visibleTo;

    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (banner) {
    await banner.deleteOne();
    res.json({ message: 'Banner removed' });
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
};

module.exports = {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
