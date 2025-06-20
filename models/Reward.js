const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pointsRequired: { type: Number, required: true },
  description: { type: String },
});

module.exports = mongoose.model('Reward', rewardSchema);