const express = require('express');
const reviewController = require("../../../controller/review.controller");
const auth = require("../../../middleware/auth")

const router = express.Router();

// http://localhost:8000/api/v1/review/get (GET - Get all reviews)
router.get('/get', reviewController.getReviews);

// http://localhost:8000/api/v1/review/get/:id (GET - Get single review by ID)
router.get('/get/:id', reviewController.getReviewById);

// http://localhost:8000/api/v1/review/post (POST - Create new review)
router.post('/post', reviewController.postReview);

// http://localhost:8000/api/v1/review/update/:id (PUT - Update review by ID)
router.put('/update/:id', auth(), reviewController.updateReview); 

// http://localhost:8000/api/v1/review/delete/:id (DELETE - Delete review by ID)
router.delete('/delete/:id', auth(), reviewController.deleteReview);

module.exports= router;