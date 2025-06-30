import React, { useState, useEffect, useRef } from 'react';
import { Star, Edit, Trash2 } from 'lucide-react';
import '../../css/Review/Review.css';
import { reviewAPI } from '../../utils/api/apiService';

const Review = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const reviewFormRef = useRef(null); // 👉 scroll target

  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    rating: 0,
    title: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [filterRating, setFilterRating] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [userVotes, setUserVotes] = useState({});

  const totalReviews = review.length;
  const ratingCounts = [5, 4, 3, 2, 1].reduce((acc, rating) => {
    acc[rating] = review.filter(r => Number(r.rating) === rating).length;
    return acc;
  }, {});

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reviewAPI.getAll();
      setReview(res.data || []);
    } catch {
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRating = (rating) => {
    setForm({ ...form, rating });
  };

  const handleEdit = (reviewData) => {
    setIsEditing(true);
    setEditingReviewId(reviewData._id || reviewData.id);
    setForm({
      name: reviewData.name,
      rating: reviewData.rating,
      title: reviewData.title,
      content: reviewData.content
    });

    // 👇 scroll into view
    reviewFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingReviewId(null);
    setForm({ name: currentUser?.name || '', rating: 0, title: '', content: '' });
    setError(null);
  };

  const handleDelete = async (reviewId) => {
    if (!currentUser) return setError('Please log in to delete your review');
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    setSubmitting(true);
    setError(null);
    setSuccessMessage('');
    try {
      await reviewAPI.delete(reviewId);
      setSuccessMessage('Review deleted successfully!');
      fetchReviews();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setError('Failed to delete review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return setError('Please log in to submit a review');
    if (!form.name || !form.rating || !form.title || !form.content) {
      return setError('Please fill all fields and select a rating');
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage('');
    try {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const reviewData = { ...form, date: currentDate };

      if (isEditing) {
        await reviewAPI.update(editingReviewId, reviewData);
        setSuccessMessage('Review updated successfully!');
        setIsEditing(false);
        setEditingReviewId(null);
      } else {
        await reviewAPI.create(reviewData);
        setSuccessMessage('Review submitted successfully!');
      }

      setForm({ name: currentUser?.name || '', rating: 0, title: '', content: '' });
      fetchReviews();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setError(isEditing ? 'Failed to update review' : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (id, voteType) => {
    const currentReview = review.find(r => r._id === id);
    if (!currentReview) return setError('Review not found');

    const voteKey = `${id}_${voteType}`;
    const oppositeType = voteType === 'helpful' ? 'unhelpful' : 'helpful';
    const oppositeKey = `${id}_${oppositeType}`;

    const hasVoted = userVotes[voteKey];
    const hasVotedOpposite = userVotes[oppositeKey];

    let updatedVotes = { ...userVotes };
    let updateData = {};

    if (hasVoted) {
      updateData[voteType] = Math.max((currentReview[voteType] || 0) - 1, 0);
      delete updatedVotes[voteKey];
    } else if (hasVotedOpposite) {
      updateData[oppositeType] = Math.max((currentReview[oppositeType] || 0) - 1, 0);
      updateData[voteType] = (currentReview[voteType] || 0) + 1;
      delete updatedVotes[oppositeKey];
      updatedVotes[voteKey] = true;
    } else {
      updateData[voteType] = (currentReview[voteType] || 0) + 1;
      updatedVotes[voteKey] = true;
    }

    setUserVotes(updatedVotes);
    setReview(prev =>
      prev.map(r => (r._id === id ? { ...r, ...updateData } : r))
    );
  };

  const averageRating = review.length > 0
    ? review.reduce((acc, r) => acc + Number(r.rating || 0), 0) / review.length
    : 0;

  const filteredReview = filterRating === 'all'
    ? review
    : review.filter(r => Number(r.rating) === Number(filterRating));

  return (
    <div className="review-page">
      <div className="container">
        <h1 className="page-title">Customer Reviews</h1>

        {loading && <div className="loading">Loading reviews...</div>}
        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <div className="overview-section">
          <div className="overview-content">
            <div className="rating-summary">
              <div className="average-rating">{averageRating.toFixed(1)}</div>
              <div className="stars-container">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={20}
                    className={star <= Math.round(averageRating) ? "star filled" : "star"}
                  />
                ))}
              </div>
              <div className="review-count">{review.length} reviews</div>
            </div>
            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="rating-bar">
                  <div className="star-label">{rating} stars</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${totalReviews ? (ratingCounts[rating] / totalReviews) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <div className="count-label">{ratingCounts[rating] || 0}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="review-form-section" ref={reviewFormRef}>
          <h2 className="section-title">{isEditing ? 'Edit Your Review' : 'Write a Review'}</h2>
          {!currentUser ? (
            <div className="login-prompt">
              <p>Please log in to submit a review.</p>
            </div>
          ) : (
            <form className="review-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name:</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  readOnly
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label>Rating:</label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={24}
                      className={`star ${star <= form.rating ? 'filled' : 'empty'}`}
                      onClick={() => handleRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Review Title:</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Summarize your experience"
                />
              </div>

              <div className="form-group">
                <label>Review Content:</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Tell us about your experience"
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={submitting} className="submit-button">
                  {submitting ? 'Submitting...' : (isEditing ? 'Update Review' : 'Submit Review')}
                </button>
                {isEditing && (
                  <button type="button" onClick={handleCancelEdit} className="cancel-button">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        <div className="filter-section">
          <span className="filter-label">Filter by:</span>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Ratings</option>
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </select>
        </div>

        <div className="reviews-list">
          {filteredReview.length > 0 ? (
            filteredReview.map(r => (
              <div key={r._id} className="review-card">
                <div className="review-header">
                  <div>
                    <h3 className="review-title">{r.title}</h3>
                    <div className="review-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < r.rating ? "star filled" : "star"}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="review-date">{r.date || "Date not available"}</span>
                </div>

                <p className="review-content">{r.content}</p>

                <div className="review-footer">
                  <div className="review-author">
                    By <span className="author-name">{r.name}</span>
                    {currentUser && (
                      r.name === currentUser.name ||
                      r.name === currentUser.email ||
                      (currentUser._id && r.userId === currentUser._id)
                    ) && <span className="own-review-indicator"> (Your Review)</span>}
                  </div>

                  <div className="review-actions">
                    {currentUser && (
                      r.name === currentUser.name ||
                      r.name === currentUser.email ||
                      (currentUser._id && r.userId === currentUser._id)
                    ) && (
                      <div className="user-actions">
                        <button onClick={() => handleEdit(r)} className="action-button edit-button"><Edit size={16} /> Edit</button>
                        <button onClick={() => handleDelete(r._id)} className="action-button delete-button"><Trash2 size={16} /> Delete</button>
                      </div>
                    )}
                  </div>

                  <div className="vote-buttons">
                    <button
                      onClick={() => handleVote(r._id, 'helpful')}
                      className={`vote-button helpful ${userVotes[`${r._id}_helpful`] ? 'voted' : ''}`}
                    >
                      Helpful ({r.helpful || 0})
                    </button>
                    <button
                      onClick={() => handleVote(r._id, 'unhelpful')}
                      className={`vote-button unhelpful ${userVotes[`${r._id}_unhelpful`] ? 'voted' : ''}`}
                    >
                      Not Helpful ({r.unhelpful || 0})
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">No reviews match your filter criteria</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
