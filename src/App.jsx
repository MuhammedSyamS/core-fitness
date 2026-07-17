// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

const METRICS = [
  { key: 'coachRating', label: 'Coach Quality', short: 'Coaches' },
  { key: 'atmosphereRating', label: 'Atmosphere & Vibe', short: 'Atmosphere' },
  { key: 'equipmentRating', label: 'Equipment Quality', short: 'Equipment' },
  { key: 'cleanlinessRating', label: 'Facility Cleanliness', short: 'Cleanliness' },
];

// ==========================================
// SHARED: EXACT GOOGLE MAPS SVG STAR
// ==========================================
function StarIcon({ filled, size = 20 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={{ 
        display: 'block', 
        transition: 'fill 0.1s ease' 
      }}
      aria-hidden="true"
    >
      <path 
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" 
        fill={filled ? 'var(--gold)' : 'var(--gold-empty)'} 
      />
    </svg>
  );
}

function StaticStars({ value, size = 15 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} filled={n <= Math.round(value)} size={size} />
      ))}
    </span>
  );
}

// ==========================================
// 1. HERO
// ==========================================
function Hero() {
  return (
    <div className="hero">
      <h1 className="hero__title">
        Core <em>Fitness</em>
      </h1>
    </div>
  );
}

// ==========================================
// 3. RATING SUMMARY — "Scoreboard"
// ==========================================
function RatingSummary({ reviews }) {
  if (reviews.length === 0) return null;

  const getAvg = (key) => {
    const total = reviews.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
    return total / reviews.length;
  };

  return (
    <div className="panel scoreboard">
      <div className="scoreboard__header">
        <h4 className="scoreboard__title">Gym Performance Overview</h4>
        <span className="scoreboard__count">{reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
      </div>
      <div className="scoreboard__grid">
        {METRICS.map(({ key, short }) => {
          const avg = getAvg(key);
          return (
            <div className="scoreboard__item" key={key}>
              <div className="scoreboard__row">
                <span className="scoreboard__label">{short}</span>
                <span className="scoreboard__value">
                  {avg.toFixed(1)}
                  <small>/5</small>
                </span>
              </div>
              <div className="scoreboard__bar">
                <div className="scoreboard__fill" style={{ width: `${(avg / 5) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 4. INTERACTIVE STAR SELECTOR (FIXED FOR UNDER LABELS)
// ==========================================
function StarRatingInput({ label, value, onChange }) {
  const [hoverValue, setHoverValue] = useState(null);

  return (
    <div className="star-field" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', width: '100%', marginBottom: '1.2rem' }}>
      <span className="star-field__label" style={{ display: 'block', margin: 0 }}>{label}</span>
      <div className="star-row" style={{ display: 'flex', gap: '4px', alignItems: 'center' }} onMouseLeave={() => setHoverValue(null)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            className="star-btn"
            aria-label={`${label}: ${star} star${star === 1 ? '' : 's'}`}
            onClick={(e) => {
              e.preventDefault(); 
              onChange(star);
            }}
            onMouseEnter={() => setHoverValue(star)}
            style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer' }}
          >
            <StarIcon filled={star <= (hoverValue || value)} size={26} />
          </button>
        ))}
        <span style={{ fontSize: '0.8rem', color: 'var(--ink-faint)', marginLeft: '0.5rem', fontWeight: '600' }}>
          ({value}/5)
        </span>
      </div>
    </div>
  );
}

// ==========================================
// 5. REVIEW FORM
// ==========================================
function ReviewForm({ onReviewAdded, onReviewConfirmed, onReviewFailed }) {
  const initialState = {
    username: '',
    comment: '',
    coachRating: 0,
    atmosphereRating: 0,
    equipmentRating: 0,
    cleanlinessRating: 0,
  };
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');

  const handleRatingChange = (metricName, ratingValue) => {
    setFormData((prev) => ({ ...prev, [metricName]: ratingValue }));
  };

  const handleTextChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim() || !formData.comment.trim()) {
      setError('Please add your name and a comment before posting.');
      return;
    }

    const unratedMetric = METRICS.find(({ key }) => !formData[key]);
    if (unratedMetric) {
      setError(`Please rate "${unratedMetric.label}" before posting.`);
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticReview = {
      ...formData,
      _id: tempId,
      createdAt: new Date().toISOString(),
      isPending: true,
    };

    onReviewAdded(optimisticReview);
    setFormData(initialState);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        onReviewConfirmed(tempId, data.data);
      } else {
        onReviewFailed(tempId);
      }
    } catch (err) {
      onReviewFailed(tempId);
    }
  };

  return (
    <form className="panel review-form" onSubmit={handleSubmit}>
      <span className="review-form__eyebrow">Customer Reviews</span>
      <h3 className="review-form__title">Write your feedback about us</h3>
      <p className="review-form__subtitle">Tell us how your session went — it helps other members choose right.</p>

      {error && <div className="form-error">{error}</div>}

      <div className="star-panel">
        {METRICS.map(({ key, label }) => (
          <StarRatingInput
            key={key}
            label={label}
            value={formData[key]}
            onChange={(val) => handleRatingChange(key, val)}
          />
        ))}
      </div>

      <input
        type="text"
        name="username"
        placeholder="Your name"
        value={formData.username}
        onChange={handleTextChange}
        className="field"
        required
      />

      <textarea
        name="comment"
        placeholder="Share details of your experience at this fitness center..."
        value={formData.comment}
        onChange={handleTextChange}
        className="field"
        required
      />

      <button type="submit" className="btn-primary">
        Post review
      </button>
    </form>
  );
}

// ==========================================
// 6. REVIEW CARD
// ==========================================
function ReviewCard({ review }) {
  const {
    username,
    comment,
    coachRating,
    atmosphereRating,
    equipmentRating,
    cleanlinessRating,
    createdAt,
    isPending,
    isLocalOnly,
  } = review;

  const metricValues = {
    coachRating,
    atmosphereRating,
    equipmentRating,
    cleanlinessRating,
  };

  return (
    <div className="review-card">
      <div className="review-card__head">
        <div className="review-card__avatar">{username ? username.charAt(0).toUpperCase() : 'A'}</div>
        <div>
          <h4 className="review-card__name">
            {username}
            {isPending && <span className="badge-pending">Posting…</span>}
            {!isPending && isLocalOnly && <span className="badge-local">Saved locally</span>}
          </h4>
          <span className="review-card__date">{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <p className="review-card__comment">{comment}</p>

      <div className="review-card__metrics">
        {METRICS.map(({ key, short }) => (
          <div className="review-card__metric" key={key}>
            <span>{short}</span>
            <StaticStars value={metricValues[key]} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="review-card review-card--skeleton" aria-hidden="true">
      <div className="review-card__head">
        <div className="skeleton skeleton--circle" />
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton--line" style={{ width: '40%' }} />
          <div className="skeleton skeleton--line" style={{ width: '25%', marginTop: 6 }} />
        </div>
      </div>
      <div className="skeleton skeleton--line" style={{ width: '95%', marginTop: 14 }} />
      <div className="skeleton skeleton--line" style={{ width: '80%', marginTop: 8 }} />
    </div>
  );
}

// ==========================================
// 7. MAIN APP
// ==========================================
export default function App() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;

  fetch(`${import.meta.env.VITE_API_URL}/api/reviews`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success) setReviews(json.data);
      })
      .catch(() => {
        if (!cancelled) setIsOffline(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleReviewAdded = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleReviewConfirmed = (tempId, serverReview) => {
    setReviews((prev) => prev.map((r) => (r._id === tempId ? serverReview : r)));
  };

  const handleReviewFailed = (tempId) => {
    setReviews((prev) => prev.map((r) => (r._id === tempId ? { ...r, isPending: false, isLocalOnly: true } : r)));
  };

  return (
    <div className="app-shell">
      <Hero />

      <div className="app-main layout-grid">
        <div className="layout-left">
          <ReviewForm
            onReviewAdded={handleReviewAdded}
            onReviewConfirmed={handleReviewConfirmed}
            onReviewFailed={handleReviewFailed}
          />
        </div>

        <div className="layout-right">
          <RatingSummary reviews={reviews} />

          <div className="feed-header">
            <h3 className="feed-header__title">All reviews ({reviews.length})</h3>
            {isOffline && <span className="offline-pill">Offline mode</span>}
          </div>

          {isLoading ? (
            <>
              <ReviewSkeleton />
              <ReviewSkeleton />
            </>
          ) : reviews.length === 0 ? (
            <div className="feed-empty">No reviews yet — be the first to share your experience.</div>
          ) : (
            reviews.map((review) => <ReviewCard key={review._id} review={review} />)
          )}
        </div>
      </div>
    </div>
  );
}