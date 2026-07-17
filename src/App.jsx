// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

const METRICS = [
  { key: 'coachRating', label: 'Coach Quality', short: 'Coaches' },
  { key: 'atmosphereRating', label: 'Atmosphere & Vibe', short: 'Atmosphere' },
  { key: 'equipmentRating', label: 'Equipment Quality', short: 'Equipment' },
  { key: 'cleanlinessRating', label: 'Facility Cleanliness', short: 'Cleanliness' },
];

// Handles fallback smoothly between production deployment environments and local dev machines
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ==========================================
// SHARED: SVG STAR 
// ==========================================
function StarIcon({ filled, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'var(--gold)' : 'var(--gold-empty)'}
      style={{ display: 'block', transition: 'fill 0.1s ease' }}
      aria-hidden="true"
    >
      <path d="M12 2.5l2.95 6.28 6.93.68-5.19 4.73 1.5 6.81L12 17.77l-6.19 3.23 1.5-6.81-5.19-4.73 6.93-.68z" />
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
// 1. HERO (Clean Centered Heading - No Buttons)
// ==========================================
function Hero({ onViewChange }) {
  return (
    <div className="hero" style={{ padding: '3rem 1.25rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 className="hero__title" style={{ cursor: 'pointer', margin: 0 }} onClick={() => { onViewChange('home'); window.history.pushState({}, '', '/'); }}>
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
// 4. INTERACTIVE STAR SELECTOR
// ==========================================
function StarRatingInput({ label, value, onChange }) {
  const [hoverValue, setHoverValue] = useState(null);

  return (
    <div className="star-field" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', width: '100%', marginBottom: '1.2rem' }}>
      <span className="star-field__label">{label}</span>
      <div className="star-row" onMouseLeave={() => setHoverValue(null)}>
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
          >
            <StarIcon filled={star <= (hoverValue || value)} size={26} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. MAIN APP INTERFACE
// ==========================================
export default function App() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('home'); 
  const [adminKey, setAdminKey] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isOffline, setIsOffline] = useState(false);

  const initialState = {
    username: '',
    comment: '',
    coachRating: 0,
    atmosphereRating: 0,
    equipmentRating: 0,
    cleanlinessRating: 0,
  };
  const [formData, setFormData] = useState(initialState);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Detects if the admin explicitly typed /admin into the browser bar
    if (window.location.pathname === '/admin') {
      setView('admin');
    }
    
    fetch(`${API_BASE_URL}/api/reviews`)
      .then((res) => {
        if (!res.ok) throw new Error('Network failure');
        return res.json();
      })
      .then((json) => { 
        if (json.success) setReviews(json.data); 
      })
      .catch(() => setIsOffline(true))
      .finally(() => setIsLoading(false));
  }, []);

  const handleRatingChange = (metricName, ratingValue) => {
    setFormData((prev) => ({ ...prev, [metricName]: ratingValue }));
  };

  const handleTextChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKey })
      });
      const data = await res.json();
      if (data.success) {
        setIsAdminAuthenticated(true);
      } else {
        setLoginError('Invalid secret credentials token.');
      }
    } catch {
      setLoginError('Authentication server unreachable.');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Purge this comment entry permanently from the logs?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/admin/delete/${id}`, {
        method: 'DELETE',
        headers: { 'admin-key': adminKey }
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.filter(r => r._id !== id));
      }
    } catch (err) { 
      alert('Delete transaction rejected by database.'); 
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.username.trim() || !formData.comment.trim()) {
      return setFormError('Please add your name and a comment before posting.');
    }

    const unratedMetric = METRICS.find(({ key }) => formData[key] === 0);
    if (unratedMetric) {
      return setFormError(`Please rate "${unratedMetric.label}" before posting.`);
    }

    const tempId = `temp-${Date.now()}`;
    const optimisticReview = {
      ...formData,
      _id: tempId,
      createdAt: new Date().toISOString(),
      isPending: true,
    };

    const payloadToSend = { ...formData };

    setReviews((prev) => [optimisticReview, ...prev]);
    setFormData(initialState);

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payloadToSend),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setReviews((prev) => prev.map((r) => (r._id === tempId ? data.data : r)));
        setIsOffline(false);
      } else {
        setFormError(data.message || 'Submission rejected by server.');
        setReviews((prev) => prev.map((r) => (r._id === tempId ? { ...r, isPending: false, isLocalOnly: true } : r)));
      }
    } catch (err) {
      setFormError('Network connection loss. Retained entry locally.');
      setReviews((prev) => prev.map((r) => (r._id === tempId ? { ...r, isPending: false, isLocalOnly: true } : r)));
    }
  };

  return (
    <div className="app-shell">
      <Hero view={view} onViewChange={setView} />

      {view === 'admin' && !isAdminAuthenticated ? (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }} className="panel">
          <form onSubmit={handleAdminLogin}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Admin Verification Required</h3>
            {loginError && <p style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>{loginError}</p>}
            <input type="password" placeholder="Enter ADMIN_SECRET_KEY" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} className="field" required />
            <button type="submit" className="btn-primary">Authenticate</button>
          </form>
        </div>
      ) : (
        <div className="app-main layout-grid" style={{ marginTop: '1rem' }}>
          
          <div className="layout-left">
            {view === 'admin' ? (
              <div className="panel" style={{ padding: '2rem', background: 'var(--accent-tint)', border: '1px solid var(--accent)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-dark)' }}>Admin System Active</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>You are authenticated. You can now delete any member review directly from the active log stream below.</p>
                <button className="btn-primary" style={{ background: 'var(--ink)' }} onClick={() => { setIsAdminAuthenticated(false); setAdminKey(''); setView('home'); window.history.pushState({}, '', '/'); }}>Logout Session</button>
              </div>
            ) : (
              <form className="panel review-form" onSubmit={handleFormSubmit}>
                <span className="review-form__eyebrow">Customer Reviews</span>
                <h3 className="review-form__title">Write your feedback about us</h3>
                <p className="review-form__subtitle">Tell us how your session went — it helps other members choose right.</p>

                {formError && <div className="form-error">{formError}</div>}

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
            )}
          </div>

          <div className="layout-right">
            <RatingSummary reviews={reviews} />

            <div className="feed-header">
              <h3 className="feed-header__title">All reviews ({reviews.length})</h3>
              {isOffline && <span className="offline-pill">Offline mode</span>}
            </div>

            {isLoading ? (
              <p>Syncing metrics...</p>
            ) : reviews.length === 0 ? (
              <div className="feed-empty">No reviews yet — be the first to share your experience.</div>
            ) : (
              reviews.map((review) => (
                <div className="review-card" key={review._id}>
                  <div className="review-card__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="review-card__avatar">{review.username ? review.username.charAt(0).toUpperCase() : 'A'}</div>
                      <div>
                        <h4 className="review-card__name">
                          {review.username}
                          {review.isPending && <span className="badge-pending">Posting…</span>}
                          {!review.isPending && review.isLocalOnly && <span className="badge-local">Saved locally</span>}
                        </h4>
                        <span className="review-card__date">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {view === 'admin' && isAdminAuthenticated && (
                      <button onClick={() => handleDeleteReview(review._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '1.2rem' }} title="Purge entry">
                        🗑️
                      </button>
                    )}
                  </div>

                  <p className="review-card__comment">{review.comment}</p>

                  <div className="review-card__metrics">
                    {METRICS.map(({ key, short }) => (
                      <div className="review-card__metric" key={key}>
                        <span>{short}</span>
                        <StaticStars value={review[key]} />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}