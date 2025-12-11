const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Post = require('../models/Post');
const Banner = require('../models/Banner');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Post.deleteMany();
    await Banner.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('13429@Rahul', salt);

    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'rahul@vitelglobal.com',
      passwordHash,
      role: 'superadmin',
    });

    console.log('Super Admin Created');

    const categories = await Category.insertMany([
      { name: 'General', slug: 'general', description: 'General topics' },
      { name: 'Tech', slug: 'tech', description: 'Technology news and tutorials' },
      { name: 'Lifestyle', slug: 'lifestyle', description: 'Lifestyle and wellness' },
    ]);

    console.log('Categories Created');

    await Post.create([
      {
        authorId: superAdmin._id,
        title: 'Welcome to kbase',
        content: 'This is the first post on kbase.',
        categoryId: categories[0]._id,
        status: 'published',
        publishedAt: Date.now(),
      },
      {
        authorId: superAdmin._id,
        title: 'Tech Trends 2025',
        content: 'AI is taking over...',
        categoryId: categories[1]._id,
        status: 'pending',
      },
    ]);

    console.log('Sample Posts Created');

    await Banner.create({
      title: 'Welcome!',
      content: 'Welcome to the new kbase platform.',
      isActive: true,
      createdBy: superAdmin._id,
    });

    console.log('Sample Banner Created');

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Post.deleteMany();
    await Banner.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
