const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sentiment: { type: String, enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'], required: true },
  score: { type: Number, required: true },
  topic: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tweet', tweetSchema);