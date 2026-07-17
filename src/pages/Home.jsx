// client/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import RatingSummary from '../components/RatingSummary';
import ReviewForm from '../components/ReviewForm';
import Reviews from '../components/Reviews';

export default function Home() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/reviews')
      .then(res => res.json())
      .then(json => { if (json.success) setReviews(json.data); })
      .catch(err => console.error(err));
  }, []);

  const handleReviewAdded = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  return (
    <div style={{ background: '#080808', minHeight: '100vh', width: '100%' }}>
      <Hero />
      
      {/* FULL WIDTH DASHBOARD CONTENT WRAPPER */}
      <div style={{
        width: '100%',
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* LEFT COLUMN: Sticky Form Controls */}
        <aside style={{ position: 'sticky', top: '2rem' }}>
          <ReviewForm onReviewAdded={handleReviewAdded} />
        </aside>

        {/* RIGHT COLUMN: Full Bleed Dynamic Data Boards */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
          <RatingSummary reviews={reviews} />
          <Reviews reviews={reviews} />
        </main>

      </div>
    </div>
  );
}