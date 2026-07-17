import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      background: '#0a0a0a',
      color: '#555',
      padding: '2rem 5%',
      textAlign: 'center',
      borderTop: '1px solid #222',
      marginTop: 'auto',
      fontSize: '0.85rem'
    }}>
      <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} IRONPULSE Systems. Engineered for community tracking.</p>
    </footer>
  );
}