const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users?search=somequery
router.get('/', async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    const users = await User.find({
      username: { $regex: new RegExp(search, 'i') } // case-insensitive search
    }).select('-passwordHash'); // exclude passwordHash from result

    res.json(users);
  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ message: 'Server error while searching for users.' });
  }
});

module.exports = router;
