const express = require('express');
const router = express.Router();
const Reward = require('../models/Reward');
const { auth, isAdmin } = require('../middleware/auth');

// Get all rewards (for users and admins)
router.get('/', auth, async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create reward (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  const { name, pointsRequired, description } = req.body;
  if (!name || !pointsRequired) {
    return res.status(400).json({ message: 'Name and points required' });
  }

  try {
    const reward = new Reward({ name, pointsRequired, description });
    await reward.save();
    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update reward (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  const { name, pointsRequired, description } = req.body;
  try {
    const reward = await Reward.findByIdAndUpdate(
      req.params.id,
      { name, pointsRequired, description },
      { new: true }
    );
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    res.json(reward);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete reward (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const reward = await Reward.findByIdAndDelete(req.params.id);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    res.json({ message: 'Reward deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;