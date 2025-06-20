const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Reward = require('../models/Reward');
const Transaction = require('../models/Transaction');
const { auth, isAdmin } = require('../middleware/auth');

// Buy item and earn points
router.post('/buy', auth, async (req, res) => {
  const { itemName, price } = req.body;
  if (!itemName || !price) {
    return res.status(400).json({ message: 'Item name and price required' });
  }

  try {
    const user = await User.findById(req.user.id);
    const pointsEarned = Math.floor(price / 10); // 1 point per $10 spent
    user.points += pointsEarned;
    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      type: 'earn',
      points: pointsEarned,
      description: `Bought ${itemName} for $${price}`,
    });
    await transaction.save();

    res.json({ message: 'Points earned', points: user.points });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Redeem reward
router.post('/redeem/:rewardId', auth, async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.rewardId);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    const user = await User.findById(req.user.id);
    if (user.points < reward.pointsRequired) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    user.points -= reward.pointsRequired;
    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      type: 'redeem',
      points: reward.pointsRequired,
      description: `Redeemed ${reward.name}`,
    });
    await transaction.save();

    res.json({ message: 'Reward redeemed', points: user.points });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// View personal transaction history
router.get('/history', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// View all users and their points (admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('username points isAdmin');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// View all transactions (admin only)
router.get('/all-transactions', auth, isAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;