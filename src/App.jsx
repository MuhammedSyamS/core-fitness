// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

const METRICS = [
  { key: 'coachRating', label: 'Coaches', short: 'Coaches' },
  { key: 'atmosphereRating', label: 'Atmosphere', short: 'Atmosphere' },
  { key: 'equipmentRating', label: 'Equipment', short: 'Equipment' },
  { key: 'cleanlinessRating', label: 'Cleanliness', short: 'Cleanliness' },
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TARGET_PRODUCTION_URL = 'https://core-fitness-lac.vercel.app/';

// ==========================================
// SHARED: SVG STAR 
// ==========================================
function StarIcon({ filled, size = 18 }) {
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

function StaticStars({ value, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} filled={n <= Math.round(value)} size={size} />
      ))}
    </span>
  );
}

// ==========================================
// SCANNABLE QR CODE ENGINE WITH DOWNLOAD MODULE
// ==========================================
function AdminQRCode({ url, size = 150 }) {
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&ecc=M&margin=1`;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadQR = async () => {
    setIsDownloading(true);
    try {
      // Fetch data chunks as a raw blob array structure
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      
      // Create a transient local object URL
      const blobUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      
      tempLink.href = blobUrl;
      tempLink.download = 'core-fitness-review-qr.png';
      
      document.body.appendChild(tempLink);
      tempLink.click();
      
      // Memory cleanup sequence loops
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('QR asset parsing extraction failure:', err);
      alert('Could not process download stream securely.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#ffffff', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
      <img 
        src={qrImageUrl} 
        alt="Core Fitness Review QR Link" 
        style={{ width: `${size}px`, height: `${size}px`, display: 'block', borderRadius: '4px' }}
      />
      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b', marginTop: '0.75rem' }}>
        Scan to Review Gym
      </span>
      <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.2rem', maxWidth: '160px', wordBreak: 'break-all', marginBottom: '0.75rem' }}>
        {url}
      </span>
      
      {/* Dynamic Download Action Trigger Layout */}
      <button 
        type="button"
        onClick={handleDownloadQR}
        disabled={isDownloading}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          background: 'var(--ink, #111111)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '0.78rem',
          fontWeight: '600',
          cursor: isDownloading ? 'not-allowed' : 'pointer',
          opacity: isDownloading ? 0.7 : 1,
          transition: 'background 0.2s ease, transform 0.1s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}
      >
        {isDownloading ? 'Downloading...' : '📥 Download QR Code'}
      </button>
    </div>
  );
}

// ==========================================
// PURE CSS/JS CONFETTI POPPER MODULE
// ==========================================
function ConfettiExplosion({ active }) {
  if (!active) return null;

  const pieces = Array.from({ length: 45 }).map((_, i) => {
    const randomLeft = Math.random() * 100;
    const randomDelay = Math.random() * 0.4;
    const randomDuration = 1.2 + Math.random() * 1.6;
    const colors = ['#ff4433', '#f5a623', '#1e9e6b', '#1a73e8', '#e91e63', '#9c27b0'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomSize = 6 + Math.random() * 7;

    return (
      <div
        key={i}
        style={{
          position: 'fixed',
          top: '-20px',
          left: `${randomLeft}%`,
          width: `${randomSize}px`,
          height: `${randomSize}px`,
          backgroundColor: randomColor,
          borderRadius: Math.random() > 0.5 ? '50%' : '3px',
          zIndex: 9999,
          opacity: 0.8,
          transform: `rotate(${Math.random() * 360}deg)`,
          animation: `fall ${randomDuration}s linear ${randomDelay}s forwards`
        }}
      />
    );
  });

  return (
    <>
      <style>{`
        @keyframes fall {
          0% { top: -20px; transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { top: 105vh; transform: translateY(0) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces}
    </>
  );
}

// ==========================================
// BRAND HERO HEADING
// ==========================================
function Hero() {
  return (
    <div className="hero" style={{ padding: '2.5rem 1.25rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 className="hero__title" style={{ margin: 0 }}>
        Core <em>Fitness</em>
      </h1>
    </div>
  );
}

// ==========================================
// RATING SUMMARY — "Scoreboard"
// ==========================================
function RatingSummary({ reviews }) {
  if (reviews.length === 0) return null;

  const getAvg = (key) => {
    const total = reviews.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
    return total / reviews.length;
  };

  return (
    <div className="panel scoreboard" style={{ width: '100%', marginBottom: '2rem' }}>
      <div className="scoreboard__header">
        <h4 className="scoreboard__title">Overall Metrics Summary</h4>
        <span className="scoreboard__count">{reviews.length} total entries</span>
      </div>
      <div className="scoreboard__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        {METRICS.map(({ key, short }) => {
          const avg = getAvg(key);
          return (
            <div className="scoreboard__item" key={key} style={{ background: '#fdfdfd', padding: '0.75rem', borderRadius: '6px', border: '1px solid #f0f0f0' }}>
              <div className="scoreboard__row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="scoreboard__label" style={{ fontWeight: '600', color: '#555' }}>{short}</span>
                <span className="scoreboard__value" style={{ fontWeight: '700', color: 'var(--ink)' }}>
                  {avg.toFixed(1)}
                  <small style={{ fontSize: '0.7rem', color: '#999' }}>/5</small>
                </span>
              </div>
              <div className="scoreboard__bar" style={{ height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                <div className="scoreboard__fill" style={{ width: `${(avg / 5) * 100}%`, height: '100%', background: 'var(--accent)' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// INTERACTIVE STAR SELECTOR
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
// EXPANDABLE REVIEW CARD
// ==========================================
function ReviewCard({ review, isAdminMode, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const commentText = review.comment ? review.comment.trim() : '';
  const isLongText = commentText.length > 120;
  
  const displayedText = isLongText && !isExpanded 
    ? `${commentText.substring(0, 120)}...` 
    : commentText;

  return (
    <div className="review-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="review-card__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="review-card__avatar">{review.username ? review.username.charAt(0).toUpperCase() : 'A'}</div>
          <div>
            <h4 className="review-card__name" style={{ margin: 0, fontSize: '1rem' }}>{review.username}</h4>
            <span className="review-card__date" style={{ fontSize: '0.75rem', color: '#888' }}>
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
            {review.phone && review.phone.trim() && (
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                📞 {review.phone}
              </div>
            )}
          </div>
        </div>
        {isAdminMode && (
          <button onClick={() => onDelete(review._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '1.2rem', padding: 0 }} title="Purge Record">
            🗑️
          </button>
        )}
      </div>

      <p className="review-card__comment" style={{ flexGrow: 1, margin: '1rem 0 1.25rem', fontSize: '0.9rem', lineHeight: '1.45', wordBreak: 'break-word' }}>
        {displayedText || <em style={{ color: '#aaa', fontSize: '0.85rem' }}>No comment provided.</em>}
        {isLongText && (
          <button 
            type="button" 
            onClick={() => setIsExpanded(!isExpanded)} 
            style={{ background: 'none', border: 'none', color: 'var(--accent)', padding: 0, marginLeft: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', textDecoration: 'underline' }}
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </p>

      <div className="review-card__metrics" style={{ borderTop: '1px solid #f3f3f3', paddingTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {METRICS.map(({ key, short }) => (
          <div className="review-card__metric" key={key} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '0.75rem', color: '#777', fontWeight: '500' }}>{short}</span>
            <StaticStars value={review[key]} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// MAIN RECONFIGURED ENGINE INTERFACE
// ==========================================
export default function App() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('home'); 
  const [adminKey, setAdminKey] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const initialState = {
    username: '',
    phone: '',
    comment: '',
    coachRating: 0,
    atmosphereRating: 0,
    equipmentRating: 0,
    cleanlinessRating: 0,
  };
  const [formData, setFormData] = useState(initialState);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setView('admin');
    }
    
    fetch(`${API_BASE_URL}/api/reviews`)
      .then((res) => {
        if (!res.ok) throw new Error('Fetch breakdown');
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
    if (!window.confirm('Purge this comment entry permanently from the database logs?')) return;
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
    setSuccessMessage(false);

    if (!formData.username.trim()) {
      return setFormError('Please enter your name.');
    }

    const unratedMetric = METRICS.find(({ key }) => formData[key] === 0);
    if (unratedMetric) {
      return setFormError(`Please select a star rating for "${unratedMetric.label}".`);
    }

    const payloadToSend = { 
      ...formData,
      username: formData.username.trim(),
      phone: formData.phone ? formData.phone.trim() : '',
      comment: formData.comment && formData.comment.trim() ? formData.comment.trim() : ''
    };

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
        setReviews((prev) => [data.data, ...prev]);
        setFormData(initialState);
        
        setShowConfetti(true);
        setSuccessMessage(true);
        
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        setFormError(data.message || 'Submission rejected by server.');
      }
    } catch (err) {
      setFormError('Network connection loss. Could not submit review.');
    }
  };

  return (
    <div className="app-shell">
      <ConfettiExplosion active={showConfetti} />
      <Hero />

      {/* VIEW VECTOR 1: SECURE AUTHENTICATION SCREEN */}
      {view === 'admin' && !isAdminAuthenticated ? (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', width: '90%' }} className="panel">
          <form onSubmit={handleAdminLogin}>
            <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>Admin Portal Access</h3>
            {loginError && <p style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>{loginError}</p>}
            <input type="password" placeholder="Enter ADMIN_SECRET_KEY" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} className="field" required />
            <button type="submit" className="btn-primary">Authenticate</button>
          </form>
        </div>
      ) : view === 'admin' && isAdminAuthenticated ? (
        
        /* VIEW VECTOR 2: FULL WIDTH MULTI-ROW MULTI-COLUMN ADMIN DASHBOARD */
        <div style={{ width: '100%', padding: '0 2rem 4rem' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ flex: '1 1 600px' }}>
              <RatingSummary reviews={reviews} />
            </div>
            <div style={{ flex: '0 0 auto', alignSelf: 'stretch', marginBottom: '2rem', margin: '0 auto' }}>
              <AdminQRCode url={TARGET_PRODUCTION_URL} />
            </div>
          </div>

          <div className="feed-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="feed-header__title" style={{ margin: 0 }}>Active Log Database Feed ({reviews.length})</h3>
            {isOffline && <span className="offline-pill">Offline mode</span>}
          </div>

          {isLoading ? (
            <p>Syncing active metrics storage logs...</p>
          ) : reviews.length === 0 ? (
            <div className="feed-empty">No incoming reviews captured yet.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', width: '100%' }}>
              {reviews.map((review) => (
                <ReviewCard 
                  key={review._id} 
                  review={review} 
                  isAdminMode={true} 
                  onDelete={handleDeleteReview} 
                />
              ))}
            </div>
          )}
        </div>
      ) : (

        /* VIEW VECTOR 3: CLIENT VIEW SUBMISSION FORM ONLY */
        <div style={{ maxWidth: '540px', margin: '0 auto', padding: '0 1.25rem 4rem', width: '100%' }}>
          <form className="panel review-form" onSubmit={handleFormSubmit}>
            <h3 className="review-form__title" style={{ marginTop: 0 }}>Write your experience about us</h3>
            <p className="review-form__subtitle">Share details of your session to help build tracking performance scores.</p>

            {formError && <div className="form-error">{formError}</div>}
            {successMessage && (
              <div style={{ color: 'var(--local-badge)', background: 'var(--local-badge-tint)', border: '1px solid #c3f0dc', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                🎉 Thank you! Your review has been submitted successfully!
              </div>
            )}

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
              placeholder="Your Name (Required)"
              value={formData.username}
              onChange={handleTextChange}
              className="field"
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (Optional)"
              value={formData.phone}
              onChange={handleTextChange}
              className="field"
              style={{ marginBottom: '1.2rem' }}
            />

            <textarea
              name="comment"
              placeholder="Share details of your experience... (Optional)"
              value={formData.comment}
              onChange={handleTextChange}
              className="field"
            />

            <button type="submit" className="btn-primary">
              Submit Review
            </button>
          </form>
        </div>
      )}
    </div>
  );
}