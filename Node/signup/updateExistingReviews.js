const mongoose = require('mongoose');
const Review = require('./src/model/review.model.js');
require('dotenv').config();

// Connect to MongoDB using the same environment variable as the main app
const MONGODB_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/finance_assistant';

async function updateExistingReviews() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all reviews that don't have a date field or have empty date
    const reviewsToUpdate = await Review.find({
      $or: [
        { date: { $exists: false } },
        { date: null },
        { date: '' }
      ]
    });

    console.log(`Found ${reviewsToUpdate.length} reviews to update`);

    // Update each review with a formatted date based on createdAt or current time
    for (const review of reviewsToUpdate) {
      let dateToUse;
      
      if (review.createdAt) {
        dateToUse = review.createdAt;
      } else {
        // If no createdAt, use current time
        dateToUse = new Date();
      }

      const formattedDate = dateToUse.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      await Review.findByIdAndUpdate(review._id, {
        date: formattedDate
      });

      console.log(`Updated review ${review._id} with date: ${formattedDate}`);
    }

    console.log('All reviews updated successfully!');
    
    // Verify the updates
    const allReviews = await Review.find();
    console.log(`Total reviews in database: ${allReviews.length}`);
    
    allReviews.forEach(review => {
      console.log(`Review ID: ${review._id}, Date: ${review.date || 'No date'}`);
    });

  } catch (error) {
    console.error('Error updating reviews:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the update function
updateExistingReviews(); 