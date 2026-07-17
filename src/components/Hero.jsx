// client/src/components/Hero.jsx
import React from 'react';

export default function Hero() {
  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(90deg, #0f0f0f 0%, #171717 100%)',
      color: '#fff',
      padding: '3rem 2rem',
      borderBottom: '1px solid #1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '800', letterSpacing: '-0.5px' }}>
        GYM PERFORMANCE <span style={{ color: '#ff2a2a' }}>METRICS HUB</span>
      </h1>
      <p style={{ fontSize: '1rem', color: '#777', margin: '0.5rem 0 0 0' }}>
        Real-time community evaluation matrix for coaches, equipment quality, ambient atmosphere, and facility sanitation.
      </p>
    </div>
  );
}