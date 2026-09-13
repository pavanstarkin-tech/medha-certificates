import React from 'react';

export default function GGULogo() {
  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      userSelect: 'none',
      maxWidth: '100%'
    }}>
      {/* GGU Tri-Color Letters exactly matching image.png */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 900,
        fontSize: 'clamp(1.4rem, 4.5vw, 2.1rem)',
        letterSpacing: '-0.04em',
        lineHeight: 0.9
      }}>
        <span style={{ color: '#4a2574' }}>G</span>
        <span style={{ color: '#a82247' }}>G</span>
        <span style={{ color: '#e11d27' }}>U</span>
      </div>

      {/* Underline bar & GODAVARI GLOBAL UNIVERSITY text with Graduation Cap */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        gap: '0.2rem',
        marginTop: '0.15rem',
        borderTop: '1.5px solid #1a1a1a',
        paddingTop: '0.12rem'
      }}>
        <span style={{
          fontSize: 'clamp(0.42rem, 1.3vw, 0.56rem)',
          fontWeight: 800,
          color: '#1a1a1a',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          fontFamily: 'Montserrat, sans-serif'
        }}>
          GODAVARI GLOBAL UNIVERSITY
        </span>

        {/* Graduation Cap */}
        <svg 
          width="11" 
          height="11" 
          viewBox="0 0 24 24" 
          fill="#1a1a1a" 
          style={{ flexShrink: 0, width: 'clamp(8px, 2vw, 11px)', height: 'clamp(8px, 2vw, 11px)' }}
        >
          <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 19.94 8.13 22 12 22C15.87 22 19 19.94 19 17.18V13.18L12 17L5 13.18Z" />
        </svg>
      </div>
    </div>
  );
}
