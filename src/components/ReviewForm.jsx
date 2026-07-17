// client/src/components/ReviewForm.jsx
import React, { useState } from 'react';

const ReviewForm = ({ onReviewAdded }) => {
  const [formData, setFormData] = useState({
    username: '',
    comment: '',
    coachRating: 5,
    atmosphereRating: 5,
    equipmentRating: 5,
    cleanlinessRating: 5
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        onReviewAdded(data.data); // Update UI state dynamically
        setFormData({ username: '', comment: '', coachRating: 5, atmosphereRating: 5, equipmentRating: 5, cleanlinessRating: 5 });
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Leave a Fitness Center Review</h3>
      <input type="text" name="username" placeholder="Your Name" value={formData.username} onChange={handleChange} required />
      <textarea name="comment" placeholder="Tell us about your experience..." value={formData.comment} onChange={handleChange} required />
      
      <div className="metrics-inputs">
        <label>Coach Quality (1-5): 
          <input type="number" name="coachRating" min="1" max="5" value={formData.coachRating} onChange={handleChange} />
        </label>
        <label>Atmosphere (1-5): 
          <input type="number" name="atmosphereRating" min="1" max="5" value={formData.atmosphereRating} onChange={handleChange} />
        </label>
        <label>Equipment Availability (1-5): 
          <input type="number" name="equipmentRating" min="1" max="5" value={formData.equipmentRating} onChange={handleChange} />
        </label>
        <label>Facility Cleanliness (1-5): 
          <input type="number" name="cleanlinessRating" min="1" max="5" value={formData.cleanlinessRating} onChange={handleChange} />
        </label>
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;