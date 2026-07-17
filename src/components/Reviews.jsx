// client/src/components/Reviews.jsx
import React from 'react';
import ReviewCard from './ReviewCard';

const Reviews = ({ reviews }) => {
  if (reviews.length === 0) {
    return <p className="no-reviews">No reviews yet. Be the first to share your experience!</p>;
  }

  return (
    <div className="reviews-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3>Community Feedback ({reviews.length})</h3>
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
};

export default Reviews;