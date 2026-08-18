// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

const METRICS = [
  { key: 'coachRating', label: 'Coaches', short: 'Coaches', description: 'Trainer guidance, support & fitness coaching' },
  { key: 'atmosphereRating', label: 'Atmosphere', short: 'Atmosphere', description: 'Overall gym environment & workout energy' },
  { key: 'equipmentRating', label: 'Equipment', short: 'Equipment', description: 'Machine quality, variety & maintenance' },
  { key: 'cleanlinessRating', label: 'Cleanliness', short: 'Cleanliness', description: 'Gym hygiene, sanitation & facility clean standards' },
  { key: 'onamCelebrationRating', label: 'Onam Celebration', short: 'Onam Celebration', description: 'Onam event arrangements, festive vibe & activities' },
];

const getReviewAvg = (r) => {
  const ratings = [
    r.coachRating,
    r.atmosphereRating,
    r.equipmentRating,
    r.cleanlinessRating,
    r.onamCelebrationRating
  ].filter(val => val !== undefined && val !== null && val > 0);

  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, val) => sum + Number(val), 0) / ratings.length;
};

// FIXED: Automatically targets your local server (port 5000) when developing locally, and Render when in production
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://core-fitness-b.onrender.com');
const TARGET_PRODUCTION_URL = 'https://core-fitness-lac.vercel.app/';

function StarIcon({ filled, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'var(--gold)' : 'var(--gold-empty)'} style={{ display: 'block', transition: 'fill 0.1s ease' }} aria-hidden="true">
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

function AdminQRCode({ url, size = 150 }) {
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&ecc=M&margin=1`;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadQR = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.download = 'core-fitness-review-qr.png';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert('Could not download QR Code image.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#ffffff', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
      <img src={qrImageUrl} alt="Core Fitness Review QR Link" style={{ width: `${size}px`, height: `${size}px`, display: 'block', borderRadius: '4px' }} />
      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b', marginTop: '0.75rem' }}>Scan to Review Gym</span>
      <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.2rem', maxWidth: '160px', wordBreak: 'break-all', marginBottom: '0.75rem' }}>{url}</span>
      <button type="button" onClick={handleDownloadQR} disabled={isDownloading} style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#111111', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '600', cursor: isDownloading ? 'not-allowed' : 'pointer', opacity: isDownloading ? 0.7 : 1, transition: 'background 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isDownloading ? 'Downloading...' : '📥 Download QR Code'}
      </button>
    </div>
  );
}

function ReviewCountdown({ targetDate }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const parts = [];
  if (timeLeft.days > 0) parts.push(`${timeLeft.days} days`);
  parts.push(`${timeLeft.hours || 0} hours`);
  parts.push(`${timeLeft.minutes || 0} minutes`);
  parts.push(`${timeLeft.seconds || 0} seconds`);

  return (
    <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
        TIME REMAINING UNTIL NEXT WEEKLY REVIEW:
      </span>
      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111111', letterSpacing: '0.5px' }}>
        {parts.length > 0 && +new Date(targetDate) > +new Date() ? parts.join(' : ') : '0 hours : 0 minutes : 0 seconds'}
      </div>
    </div>
  );
}

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
      <div key={i} style={{ position: 'fixed', top: '-20px', left: `${randomLeft}%`, width: `${randomSize}px`, height: `${randomSize}px`, backgroundColor: randomColor, borderRadius: Math.random() > 0.5 ? '50%' : '3px', zIndex: 9999, opacity: 0.8, transform: `rotate(${Math.random() * 360}deg)`, animation: `fall ${randomDuration}s linear ${randomDelay}s forwards` }} />
    );
  });
  return (
    <>
      <style>{`@keyframes fall { 0% { top: -20px; transform: translateY(0) rotate(0deg); opacity: 1; } 100% { top: 105vh; transform: translateY(0) rotate(720deg); opacity: 0; } }`}</style>
      {pieces}
    </>
  );
}

function Hero() {
  return (
    <div className="hero" style={{ padding: '2.5rem 1.25rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 className="hero__title" style={{ margin: 0 }}>Core <em>Fitness</em></h1>
    </div>
  );
}

function RatingSummary({ reviews }) {
  if (reviews.length === 0) {
    return (
      <div className="panel scoreboard" style={{ width: '100%', marginBottom: '2rem', padding: '2rem', textAlign: 'center' }}>
        <h4 className="scoreboard__title" style={{ marginBottom: '0.5rem' }}>Overall Metrics Summary</h4>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>No reviews submitted yet. Log data will show up here once reviews are added.</p>
      </div>
    );
  }

  const getAvg = (key) => {
    const total = reviews.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
    return total / reviews.length;
  };

  const reviewsWithAvg = reviews.map(r => {
    const avg = getReviewAvg(r);
    return { ...r, avg };
  });

  const totalReviews = reviews.length;
  const overallAvg = reviewsWithAvg.reduce((sum, r) => sum + r.avg, 0) / totalReviews;

  const positiveReviews = reviewsWithAvg.filter(r => r.avg >= 4.0).length;
  const satisfactionRate = totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0;

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviewsWithAvg.forEach(r => {
    const rounded = Math.round(r.avg);
    const key = rounded >= 5 ? 5 : rounded <= 1 ? 1 : rounded;
    starCounts[key]++;
  });

  return (
    <div className="panel scoreboard-enhanced" style={{ width: '100%', marginBottom: '2rem' }}>
      <div className="scoreboard__header" style={{ borderBottom: '1px solid var(--line)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h4 className="scoreboard__title" style={{ fontSize: '1.2rem', margin: 0 }}>Gym Analytics Dashboard</h4>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>Real-time student feedback statistics</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="scoreboard__count" style={{ display: 'block', fontSize: '1.25rem', fontWeight: '800', color: 'var(--ink)' }}>{totalReviews}</span>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-faint)', fontWeight: '600' }}>Total Reviews</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-stats-row">
          <div className="stat-card">
            <span className="stat-label">Average Score</span>
            <div className="stat-value-container">
              <span className="stat-value">{overallAvg.toFixed(2)}</span>
              <span className="stat-max">/5.0</span>
            </div>
            <div style={{ marginTop: '0.25rem' }}>
              <StaticStars value={overallAvg} size={14} />
            </div>
          </div>
          
          <div className="stat-card">
            <span className="stat-label">Satisfaction Rate</span>
            <div className="stat-value-container">
              <span className="stat-value" style={{ color: satisfactionRate >= 80 ? 'var(--local-badge)' : satisfactionRate >= 50 ? 'var(--gold)' : 'var(--accent)' }}>
                {satisfactionRate.toFixed(0)}%
              </span>
            </div>
            <span className="stat-subtext">Reviews scored 4.0+ stars</span>
          </div>
        </div>

        <div className="dashboard-charts-grid">
          <div className="charts-card">
            <h5 className="charts-card-title">Performance by Category</h5>
            <div className="scoreboard__grid" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {METRICS.map(({ key, label }) => {
                const avg = getAvg(key);
                return (
                  <div className="scoreboard__item" key={key}>
                    <div className="scoreboard__row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', alignItems: 'center' }}>
                      <span className="scoreboard__label" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--ink-soft)' }}>{label}</span>
                      <span className="scoreboard__value" style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--ink)' }}>
                        {avg.toFixed(1)} <span style={{ fontSize: '0.7rem', color: 'var(--ink-faint)', fontWeight: 'normal' }}>/5</span>
                      </span>
                    </div>
                    <div className="scoreboard__bar" style={{ height: '6px', background: 'var(--surface-strong)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div className="scoreboard__fill" style={{ width: `${(avg / 5) * 100}%`, height: '100%', background: 'var(--accent)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="charts-card">
            <h5 className="charts-card-title">Score Distribution</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = starCounts[stars];
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <span style={{ width: '48px', fontWeight: '600', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {stars} ⭐
                    </span>
                    <div style={{ flexGrow: 1, height: '8px', background: 'var(--surface-strong)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: stars >= 4 ? 'var(--local-badge)' : stars === 3 ? 'var(--gold)' : 'var(--accent)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                    </div>
                    <span style={{ width: '28px', textAlign: 'right', fontWeight: '700', color: 'var(--ink-soft)' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StarRatingInput({ label, description, value, onChange }) {
  const [hoverValue, setHoverValue] = useState(null);
  return (
    <div className="star-field" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.35rem', width: '100%', marginBottom: '1.2rem' }}>
      <div>
        <span className="star-field__label" style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--ink)' }}>{label}</span>
        {description && (
          <span style={{ display: 'block', fontSize: '0.76rem', color: 'var(--ink-soft)', marginTop: '2px', fontWeight: '400' }}>
            {description}
          </span>
        )}
      </div>
      <div className="star-row" onMouseLeave={() => setHoverValue(null)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button type="button" key={star} className="star-btn" onClick={(e) => { e.preventDefault(); onChange(star); }} onMouseEnter={() => setHoverValue(star)}>
            <StarIcon filled={star <= (hoverValue || value)} size={26} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review, isAdminMode, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const commentText = review.comment ? review.comment.trim() : '';
  const isLongText = commentText.length > 120;
  const displayedText = isLongText && !isExpanded ? `${commentText.substring(0, 120)}...` : commentText;

  const handleCopyNumber = () => {
    if (!review.phone) return;
    navigator.clipboard.writeText(review.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhoneDigits = review.phone ? review.phone.replace(/\D/g, '') : '';

  return (
    <div className="review-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="review-card__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="review-card__avatar">{review.username ? review.username.charAt(0).toUpperCase() : 'A'}</div>
          <div>
            <h4 className="review-card__name" style={{ margin: 0, fontSize: '1rem' }}>{review.username}</h4>
            <span className="review-card__date" style={{ fontSize: '0.75rem', color: '#888' }}>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</span>
            {review.phone && review.phone.trim() && (
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>📞 {review.phone}</div>
            )}
          </div>
        </div>
        {isAdminMode && (
          <button onClick={() => onDelete(review._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '1.2rem', padding: 0 }}>🗑️</button>
        )}
      </div>

      <p className="review-card__comment" style={{ flexGrow: 1, margin: '1rem 0 1.25rem', fontSize: '0.9rem', lineHeight: '1.45', wordBreak: 'break-word' }}>
        {displayedText || <em style={{ color: '#aaa', fontSize: '0.85rem' }}>No comment provided.</em>}
        {isLongText && (
          <button type="button" onClick={() => setIsExpanded(!isExpanded)} style={{ background: 'none', border: 'none', color: 'var(--accent)', padding: 0, marginLeft: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', textDecoration: 'underline' }}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </p>

      {isAdminMode && review.phone && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button onClick={handleCopyNumber} style={{ flex: '1 1 auto', padding: '4px 8px', fontSize: '0.72rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', color: '#334155' }}>
            {copied ? '✅ Copied!' : '📋 Copy Phone'}
          </button>
          <a href={`tel:${review.phone}`} style={{ flex: '1 1 auto', padding: '4px 8px', fontSize: '0.72rem', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '4px', textAlign: 'center', textDecoration: 'none', fontWeight: '600', color: '#0369a1' }}>
            📞 Call Now
          </a>
          <a href={`https://wa.me/${cleanPhoneDigits}`} target="_blank" rel="noopener noreferrer" style={{ flex: '1 1 auto', padding: '4px 8px', fontSize: '0.72rem', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '4px', textAlign: 'center', textDecoration: 'none', fontWeight: '600', color: '#15803d' }}>
            💬 WhatsApp
          </a>
        </div>
      )}

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

export default function App() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('home'); 
  const [adminKey, setAdminKey] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [successMessage, setSuccessMessage] = useState(false);
  const [lockUntilDate, setLockUntilDate] = useState(null);

  const initialState = { username: '', phone: '', comment: '', coachRating: 0, atmosphereRating: 0, equipmentRating: 0, cleanlinessRating: 0, onamCelebrationRating: 0 };
  const [formData, setFormData] = useState(initialState);
  const [formError, setFormError] = useState('');

  // Search, filtering and sorting states for the admin panel
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Admin login password visibility toggle state
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setView('admin');
      
      const savedKey = localStorage.getItem('admin_key');
      if (savedKey) {
        fetch(`${API_BASE_URL}/api/reviews/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: savedKey })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAdminKey(savedKey);
            setIsAdminAuthenticated(true);
          } else {
            localStorage.removeItem('admin_key');
          }
        })
        .catch(() => {});
      }
    }
    
    fetch(`${API_BASE_URL}/api/reviews`)
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => { 
        if (data.success) {
          setReviews(data.data);

          const phone = localStorage.getItem("review_phone");
          if (!phone) return;

          const review = data.data.find(r => r.phone === phone);
          if (!review) return;

          const nextWeek = new Date(review.createdAt);
          nextWeek.setDate(nextWeek.getDate() + 7);

          if (new Date() < nextWeek) {
            setLockUntilDate(nextWeek.toISOString());
          } else {
            localStorage.removeItem("review_phone");
          }
        } 
      })
      .catch(() => console.warn('Sync issues detected.'))
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
        localStorage.setItem('admin_key', adminKey);
      }
      else setLoginError('Invalid secret credentials token.');
    } catch {
      setLoginError('Authentication server unreachable.');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Purge this comment entry permanently?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/admin/delete/${id}`, {
        method: 'DELETE',
        headers: { 'admin-key': adminKey }
      });
      const data = await res.json();
      if (data.success) setReviews(prev => prev.filter(r => r._id !== id));
    } catch { alert('Delete transaction rejected.'); }
  };

  const handleDeleteAllReviews = async () => {
    const doubleCheck = window.confirm('🚨 WARNING: You are about to permanently delete ALL reviews from the database. This action is irreversible and cannot be undone. Are you sure you want to proceed?');
    if (!doubleCheck) return;

    const confirmationInput = window.prompt("Type 'DELETE ALL' in all caps to authorize the complete purge of the reviews database:");
    if (confirmationInput !== 'DELETE ALL') {
      alert("Purge cancelled. The confirmation code did not match.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/admin/delete-all`, {
        method: 'DELETE',
        headers: { 'admin-key': adminKey }
      });
      const data = await res.json();
      if (data.success) {
        setReviews([]);
        alert("Success: All reviews have been purged from the database.");
      } else {
        alert(data.message || 'Purge all transaction rejected.');
      }
    } catch { 
      alert('Delete all transaction failed due to connection error.'); 
    }
  };



  const handleExportPDF = () => {
    if (filteredAndSortedReviews.length === 0) {
      alert("No review data matching the current filters to export.");
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to open the PDF report print preview.");
      return;
    }

    const totalSubset = filteredAndSortedReviews.length;
    const overallAvg = (filteredAndSortedReviews.reduce((sum, r) => sum + getReviewAvg(r), 0) / totalSubset).toFixed(2);
    const positiveReviews = filteredAndSortedReviews.filter(r => getReviewAvg(r) >= 4.0).length;
    const satisfactionRate = ((positiveReviews / totalSubset) * 100).toFixed(0);

    const getCategoryAvg = (key) => {
      const total = filteredAndSortedReviews.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
      return total / totalSubset;
    };

    const coachAvg = getCategoryAvg('coachRating');
    const atmosphereAvg = getCategoryAvg('atmosphereRating');
    const equipmentAvg = getCategoryAvg('equipmentRating');
    const cleanlinessAvg = getCategoryAvg('cleanlinessRating');
    const onamCelebrationAvg = getCategoryAvg('onamCelebrationRating');

    const getStars = (rating) => {
      const rounded = Math.round(rating);
      return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
    };

    const reviewsHtml = filteredAndSortedReviews.map((r, i) => {
      const avg = getReviewAvg(r).toFixed(2);
      return `
        <div class="review-item">
          <div class="review-meta">
            <span class="review-index">Review #${i + 1}</span>
            <span class="review-user"><strong>${r.username}</strong> ${r.phone ? `(${r.phone})` : ''}</span>
            <span class="review-date">${new Date(r.createdAt).toLocaleDateString()} ${new Date(r.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          <div class="rating-scores">
            <span>Coaches: <strong class="stars">${getStars(r.coachRating)}</strong> <small>(${r.coachRating}/5)</small></span> | 
            <span>Atmosphere: <strong class="stars">${getStars(r.atmosphereRating)}</strong> <small>(${r.atmosphereRating}/5)</small></span> | 
            <span>Equipment: <strong class="stars">${getStars(r.equipmentRating)}</strong> <small>(${r.equipmentRating}/5)</small></span> | 
            <span>Cleanliness: <strong class="stars">${getStars(r.cleanlinessRating)}</strong> <small>(${r.cleanlinessRating}/5)</small></span> | 
            <span>Onam Celebration: <strong class="stars">${getStars(r.onamCelebrationRating || 0)}</strong> <small>(${r.onamCelebrationRating || 0}/5)</small></span> | 
            <span class="avg-badge">Average: <strong>${avg}/5</strong></span>
          </div>
          <div class="review-comment">
            ${r.comment ? r.comment.trim() : '<em class="no-comment">No comment provided.</em>'}
          </div>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Core Fitness - Reviews Report</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #1e293b;
            line-height: 1.5;
            padding: 40px;
            background: #fff;
            margin: 0;
          }
          .header {
            border-bottom: 2px solid #ff4433;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .title h1 {
            margin: 0;
            font-size: 28px;
            color: #0f172a;
            font-weight: 800;
          }
          .title p {
            margin: 5px 0 0;
            font-size: 14px;
            color: #64748b;
          }
          .report-info {
            text-align: right;
            font-size: 13px;
            color: #64748b;
          }
          .summary-cards {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
          }
          .card {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            background: #f8fafc;
            text-align: center;
          }
          .card-value {
            font-size: 28px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 5px;
          }
          .card-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
            font-weight: 600;
          }
          .print-category-section {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            background: #f8fafc;
            margin-bottom: 30px;
          }
          .print-category-section h3 {
            margin: 0 0 12px 0;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
          }
          .category-grid {
            display: flex;
            justify-content: space-between;
            gap: 10px;
          }
          .category-col {
            flex: 1;
            text-align: center;
          }
          .category-label {
            font-size: 10px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 2px;
          }
          .category-value {
            font-size: 16px;
            font-weight: 800;
            color: #0f172a;
          }
          .category-stars {
            color: #f5a623;
            font-size: 11px;
            margin-top: 2px;
          }
          .review-item {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
            page-break-inside: avoid;
            background: #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          }
          .review-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
            border-bottom: 1px dashed #e2e8f0;
            padding-bottom: 8px;
          }
          .review-index {
            font-weight: 700;
            color: #ff4433;
          }
          .review-user {
            color: #0f172a;
          }
          .review-date {
            color: #64748b;
          }
          .rating-scores {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 15px;
          }
          .rating-scores span {
            margin-right: 8px;
            display: inline-block;
          }
          .rating-scores small {
            color: #64748b;
            font-size: 11px;
          }
          .stars {
            color: #f5a623;
            font-size: 14px;
            letter-spacing: 0.5px;
          }
          .avg-badge {
            background: #fff1ef;
            color: #ff4433;
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 700;
          }
          .review-comment {
            font-size: 14px;
            color: #334155;
            white-space: pre-wrap;
            background: #f8fafc;
            padding: 12px 15px;
            border-radius: 6px;
            border: 1px solid #f1f5f9;
            line-height: 1.6;
          }
          .no-comment {
            color: #94a3b8;
            font-style: italic;
          }
          @media print {
            body { padding: 0; }
            .review-item { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">
            <h1>Core Fitness Review Log Report</h1>
            <p>Generated feedback log summary statement</p>
          </div>
          <div class="report-info">
            <strong>Date:</strong> ${new Date().toLocaleString()}<br/>
            <strong>Exported Entries:</strong> ${totalSubset}
          </div>
        </div>

        <div class="summary-cards">
          <div class="card">
            <div class="card-label">Overall Average Score</div>
            <div class="card-value">${overallAvg} / 5.0</div>
          </div>
          <div class="card">
            <div class="card-label">Satisfaction Rate</div>
            <div class="card-value">${satisfactionRate}%</div>
          </div>
          <div class="card">
            <div class="card-label">Total Submissions</div>
            <div class="card-value">${totalSubset}</div>
          </div>
        </div>

        <div class="print-category-section">
          <h3>Performance by Category</h3>
          <div class="category-grid">
            <div class="category-col">
              <div class="category-label">Coaches</div>
              <div class="category-value">${coachAvg.toFixed(1)} / 5</div>
              <div class="category-stars">${getStars(coachAvg)}</div>
            </div>
            <div class="category-col">
              <div class="category-label">Atmosphere</div>
              <div class="category-value">${atmosphereAvg.toFixed(1)} / 5</div>
              <div class="category-stars">${getStars(atmosphereAvg)}</div>
            </div>
            <div class="category-col">
              <div class="category-label">Equipment</div>
              <div class="category-value">${equipmentAvg.toFixed(1)} / 5</div>
              <div class="category-stars">${getStars(equipmentAvg)}</div>
            </div>
            <div class="category-col">
              <div class="category-label">Cleanliness</div>
              <div class="category-value">${cleanlinessAvg.toFixed(1)} / 5</div>
              <div class="category-stars">${getStars(cleanlinessAvg)}</div>
            </div>
            <div class="category-col">
              <div class="category-label">Onam Celebration</div>
              <div class="category-value">${onamCelebrationAvg.toFixed(1)} / 5</div>
              <div class="category-stars">${getStars(onamCelebrationAvg)}</div>
            </div>
          </div>
        </div>

        <div class="reviews-list">
          ${reviewsHtml}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 150);
  };

  const filteredAndSortedReviews = reviews.filter(review => {
    const nameStr = (review.username || '').toLowerCase();
    const phoneStr = (review.phone || '');
    const commentStr = (review.comment || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = 
      nameStr.includes(searchLower) || 
      phoneStr.includes(searchLower) || 
      commentStr.includes(searchLower);

    const avgRating = getReviewAvg(review);
    const roundedAvg = Math.round(avgRating);

    const matchesRating = ratingFilter === 'all' || roundedAvg === parseInt(ratingFilter, 10);

    return matchesSearch && matchesRating;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    const avgA = getReviewAvg(a);
    const avgB = getReviewAvg(b);
    if (sortBy === 'highest') {
      return avgB - avgA;
    }
    if (sortBy === 'lowest') {
      return avgA - avgB;
    }
    return 0;
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage(false);

    if (!formData.username.trim()) return setFormError('Please enter your name.');
    if (!formData.phone.trim()) return setFormError('Please enter your phone number.');

    const unratedMetric = METRICS.find(({ key }) => formData[key] === 0);
    if (unratedMetric) return setFormError(`Please select a star rating for "${unratedMetric.label}".`);

    const payloadToSend = { 
      ...formData,
      username: formData.username.trim(),
      phone: formData.phone.trim(),
      comment: formData.comment ? formData.comment.trim() : ''
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payloadToSend),
      });
      const data = await res.json();
      
      if (res.status === 201 && data.success) {
        setReviews((prev) => [data.data, ...prev]);
        setFormData(initialState);
        setShowConfetti(true);
        setSuccessMessage(true);
        
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        setLockUntilDate(nextWeek.toISOString());
        
        localStorage.setItem("review_phone", payloadToSend.phone);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        if (data.isLocked || res.status === 429) {
          setLockUntilDate(data.nextAvailableTime);
          localStorage.setItem("review_phone", payloadToSend.phone);
          setSuccessMessage(false);
          return;
        }
        setFormError(data.message || 'Submission rejected.');
      }
    } catch {
      setFormError('Connection loss. Could not submit review.');
    }
  };

  return (
    <div className="app-shell">
      <ConfettiExplosion active={showConfetti} />
      <Hero />

      {view === 'admin' && !isAdminAuthenticated ? (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', width: '90%' }} className="panel">
          <form onSubmit={handleAdminLogin}>
            <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'var(--font-display)' }}>Admin Portal Access</h3>
            {loginError && <p style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>{loginError}</p>}
            <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter ADMIN_SECRET_KEY" 
                value={adminKey} 
                onChange={(e) => setAdminKey(e.target.value)} 
                className="field" 
                style={{ marginBottom: 0, paddingRight: '2.5rem' }} 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
            <button type="submit" className="btn-primary">Authenticate</button>
          </form>
        </div>
      ) : view === 'admin' && isAdminAuthenticated ? (
        <div style={{ width: '100%', padding: '0 2rem 4rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ flex: '1 1 600px' }}>
              <RatingSummary reviews={reviews} />
            </div>
            <div style={{ flex: '0 0 auto', marginBottom: '2rem', margin: '0 auto' }}>
              <AdminQRCode url={TARGET_PRODUCTION_URL} />
            </div>
          </div>

          <div className="admin-controls-panel" style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
              
              <div style={{ flex: '1 1 250px', position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="🔍 Search by name, phone, comment..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="field" 
                  style={{ marginBottom: 0 }} 
                />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--ink-soft)' }}>Rating:</span>
                  <select 
                    value={ratingFilter} 
                    onChange={(e) => setRatingFilter(e.target.value)}
                    style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', background: 'var(--bg)', color: 'var(--ink)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500' }}
                  >
                    <option value="all">⭐ All Ratings</option>
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                    <option value="3">⭐⭐⭐ 3 Stars</option>
                    <option value="2">⭐⭐ 2 Stars</option>
                    <option value="1">⭐ 1 Star</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--ink-soft)' }}>Sort:</span>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', background: 'var(--bg)', color: 'var(--ink)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500' }}
                  >
                    <option value="newest">📅 Newest First</option>
                    <option value="oldest">📅 Oldest First</option>
                    <option value="highest">📈 Highest Rated</option>
                    <option value="lowest">📉 Lowest Rated</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={handleExportPDF} 
                  style={{ padding: '0.55rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}
                >
                  📄 Export PDF
                </button>
                <button 
                  type="button" 
                  onClick={handleDeleteAllReviews} 
                  style={{ padding: '0.55rem 1rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}
                >
                  🚨 Delete All
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    localStorage.removeItem('admin_key');
                    setIsAdminAuthenticated(false);
                    setAdminKey('');
                  }} 
                  style={{ padding: '0.55rem 1rem', background: '#64748b', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}
                >
                  🚪 Logout
                </button>
              </div>

            </div>
          </div>

          <div className="feed-header" style={{ marginBottom: '1.5rem', borderTop: 'none', paddingTop: 0 }}>
            <h3 className="feed-header__title" style={{ margin: 0, fontSize: '1.2rem' }}>
              Active Database Feed ({filteredAndSortedReviews.length} of {reviews.length})
            </h3>
            {(searchTerm || ratingFilter !== 'all') && (
              <button 
                onClick={() => { setSearchTerm(''); setRatingFilter('all'); }} 
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600', textDecoration: 'underline', padding: 0 }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {isLoading ? ( 
            <p>Syncing storage logs...</p> 
          ) : filteredAndSortedReviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', margin: 0 }}>No reviews match your filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', width: '100%' }}>
              {filteredAndSortedReviews.map((review) => ( 
                <ReviewCard key={review._id} review={review} isAdminMode={true} onDelete={handleDeleteReview} /> 
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ maxWidth: '540px', margin: '0 auto', padding: '0 1.25rem 4rem', width: '100%' }}>
          {lockUntilDate ? (
            <div className="panel" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{successMessage ? '🎉' : '⏳'}</div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#111111', fontSize: '1.4rem', fontWeight: '800' }}>
                {successMessage ? 'You successfully submitted the review!' : 'Review Submission Locked'}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>
                Thank you for your response. To keep performance metrics true, feedback submission is locked to one review per week.
              </p>
              <ReviewCountdown targetDate={lockUntilDate} />
            </div>
          ) : (
            <form className="panel review-form" onSubmit={handleFormSubmit}>
              <h3 className="review-form__title" style={{ marginTop: 0 }}>Write your experience about us</h3>
              <p className="review-form__subtitle">Share details of your session to help build tracking performance scores.</p>

              {formError && <div className="form-error" style={{ marginBottom: '1rem' }}>{formError}</div>}

              <div className="star-panel">
                {METRICS.map(({ key, label, description }) => (
                  <StarRatingInput key={key} label={label} description={description} value={formData[key]} onChange={(val) => handleRatingChange(key, val)} />
                ))}
              </div>

              <input type="text" name="username" placeholder="Your Name" value={formData.username} onChange={handleTextChange} className="field" required />
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleTextChange} className="field" required style={{ marginBottom: '1.2rem' }} />
              <textarea name="comment" placeholder="Share details of your experience... (Optional)" value={formData.comment} onChange={handleTextChange} className="field" />

              <button type="submit" className="btn-primary">Submit Review</button>
            </form>
          )}
        </div>
      )}
      
    </div>
  );
} 