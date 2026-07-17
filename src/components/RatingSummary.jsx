// client/src/components/RatingSummary.jsx
import React from 'react';

export default function RatingSummary({ reviews }) {
  if (reviews.length === 0) return null;

  const getAvg = (key) => {
    const total = reviews.reduce((acc, curr) => acc + (curr[key] || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  const metrics = [
    { label: '🏋️‍♂️ Coach Quality', val: getAvg('coachRating') },
    { label: '🔥 Atmosphere', val: getAvg('atmosphereRating') },
    { label: '💪 Equipment', val: getAvg('equipmentRating') },
    { label: '✨ Cleanliness', val: getAvg('cleanlinessRating') }
  ];

  return (
    <div style={{ background: '#0f0f0f', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1a1a1a', width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: '#141414', padding: '1.2rem', borderRadius: '6px', border: '1px solid #222', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>{m.label}</span>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: '#fff' }}>
              {m.val} <span style={{ color: '#ff2a2a', fontSize: '1.2rem' }}>★</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}y;