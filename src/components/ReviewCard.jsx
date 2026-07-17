// client/src/components/ReviewCard.jsx
import React from 'react';

const ReviewCard = ({ review }) => {
  const { 
    username, 
    rating, 
    comment, 
    coachRating, 
    atmosphereRating, 
    equipmentRating, 
    cleanlinessRating, 
    createdAt 
  } = review;

  return (
    <div className="review-card">
      <div className="review-header">
        <h4>{username}</h4>
        <span className="overall-rating">⭐ {rating}/5</span>
      </div>
      
      <p className="review-comment">"{comment}"</p>
      
      {/* Gym-Specific Ratings Display */}
      <div className="gym-metrics">
        <div className="metric">
          <span>🏋️‍♂️ Coach:</span>
          <span className="stars">{'★'.repeat(coachRating)}{'☆'.repeat(5 - coachRating)}</span>
        </div>
        <div className="metric">
          <span>🔥 Atmosphere:</span>
          <span className="stars">{'★'.repeat(atmosphereRating)}{'☆'.repeat(5 - atmosphereRating)}</span>
        </div>
        <div className="metric">
          <span>💪 Equipment:</span>
          <span className="stars">{'★'.repeat(equipmentRating)}{'☆'.repeat(5 - equipmentRating)}</span>
        </div>
        <div className="metric">
          <span>✨ Cleanliness:</span>
          <span className="stars">{'★'.repeat(cleanlinessRating)}{'☆'.repeat(5 - cleanlinessRating)}</span>
        </div>
      </div>
      
      <span className="review-date">
        {new Date(createdAt).toLocaleDateString()}
      </span>
    </div>
  );
};

export default ReviewCard;