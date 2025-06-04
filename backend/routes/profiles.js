const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Follow = require('../models/follow'); // For follower/following counts

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('picture');

// GET /api/profile/:id - Fetch user profile with follower/following counts
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [followersCount, followingCount] = await Promise.all([
      Follow.countDocuments({ followingId: userId }),
      Follow.countDocuments({ followerId: userId }),
    ]);

    const picture = user.picture
      ? `http://localhost:5000/${user.picture.replace(/\\/g, '/')}`
      : '';

    res.json({
      username: user.username,
      email: user.email,
      picture,
      followers: followersCount,
      following: followingCount,
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/profile/:id - Update user profile
router.put('/:id', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message || 'File upload failed' });
    }

    try {
      const userId = req.params.id;

      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }

      const { username, email, password } = req.body;

      if (!username && !email && !req.file && !password) {
        return res.status(400).json({
          message: 'At least one field (username, email, password, or picture) is required to update',
        });
      }

      if (username && (typeof username !== 'string' || username.length < 3)) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long' });
      }

      if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      const query = [];
      if (username) query.push({ username });
      if (email) query.push({ email });

      if (query.length > 0) {
        const existingUser = await User.findOne({
          $or: query,
          _id: { $ne: userId },
        });

        if (existingUser) {
          return res.status(400).json({ message: 'Username or email already in use' });
        }
      }

      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (password) updateData.password = password; // In production, hash this!
      if (req.file) updateData.picture = `uploads/${req.file.filename}`;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-passwordHash');

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const picture = updatedUser.picture
        ? `http://localhost:5000/${updatedUser.picture.replace(/\\/g, '/')}`
        : '';

      res.json({
        message: 'Profile updated successfully',
        user: {
          username: updatedUser.username,
          email: updatedUser.email,
          picture,
        },
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.code === 11000) {
        return res.status(400).json({ message: 'Username or email already in use' });
      }
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
});

module.exports = router;
