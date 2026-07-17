import React from 'react';

export default function Navbar() {
  return (
    <nav style={{
      background: '#0a0a0a',
      color: '#fff',
      padding: '1.2rem 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid #ff2a2a',
      boxShadow: '0 4px 20px rgba(255, 42, 42, 0.1)'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', letterSpacing: '1px' }}>
        IRON<span style={{ color: '#ff2a2a' }}>PULSE</span>
      </h1>
      <span style={{ fontSize: '0.9rem', color: '#aaa', border: '1px solid #333', padding: '0.4rem 1rem', borderRadius: '20px' }}>
        ⚡ Fitness Community
      </span>
    </nav>
  );
}