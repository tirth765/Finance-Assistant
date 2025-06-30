const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  title: String,
  content: String,
  date: String,
  helpful: { type: Number, default: 0 },
  unhelpful: { type: Number, default: 0 }
}, {
  timestamps: true // This adds createdAt and updatedAt fields automatically
});

const Review = mongoose.model("Review", reviewSchema)
module.exports = Review;
