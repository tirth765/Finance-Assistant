const Review = require('../model/review.model.js');

const reviewController = {};

reviewController.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reviews',
      error: error.message
    });
  }
};

reviewController.postReview = async (req, res) => {
  try {
    const reviewData = {
      ...req.body,
      date: req.body.date || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
    const review = new Review(reviewData);
    const saved = await review.save();
    console.log('Created review with date:', saved.date);
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

reviewController.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Update review request:', { id, body: req.body });

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID format'
      });
    }

    const updateData = {
      ...req.body,
      date: req.body.date || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    const updated = await Review.findByIdAndUpdate(id, updateData, { new: true });
    console.log('Update result with date:', updated.date);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

reviewController.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

reviewController.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error getting review:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to get review',
      error: error.message
    });
  }
};

module.exports = reviewController;