const express = require('express');
const router = express.Router();
const Follow = require('./models/follow');

// POST /api/follow - Follow a user
router.post('/', async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId) {
      return res.status(400).json({ error: 'followerId and followingId are required.' });
    }

    if (followerId === followingId) {
      return res.status(400).json({ error: 'You cannot follow yourself.' });
    }

    const alreadyFollowing = await Follow.findOne({
      follower: followerId,
      following: followingId,
    });

    if (alreadyFollowing) {
      return res.status(409).json({ message: 'Already following.' });
    }

    const newFollow = new Follow({ follower: followerId, following: followingId });
    await newFollow.save();

    res.status(201).json(newFollow);
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Failed to follow user.' });
  }
});

// GET /api/follow/following/:followerId - Get all users followed by a user
router.get('/following/:followerId', async (req, res) => {
  try {
    const follows = await Follow.find({ follower: req.params.followerId });
    res.status(200).json(follows);
  } catch (err) {
    console.error('Error fetching follows:', err);
    res.status(500).json({ error: 'Failed to load following list.' });
  }
});

// DELETE /api/follow - Unfollow a user
router.delete('/', async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId) {
      return res.status(400).json({ error: 'followerId and followingId are required.' });
    }

    const deleted = await Follow.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Follow relationship not found.' });
    }

    res.status(200).json({ message: 'Unfollowed successfully.' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Failed to unfollow user.' });
  }
});

module.exports = router;
