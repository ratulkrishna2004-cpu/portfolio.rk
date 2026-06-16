import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const { isDevMode, logout, setShowLogin } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { to: '/', label: 'Home', icon: 'mdi-home' },
    { to: '/cv', label: 'CV', icon: 'mdi-file-account' },
    { to: '/skills', label: 'Skills', icon: 'mdi-lightning-bolt' },
    { to: '/research', label: 'Research', icon: 'mdi-flask' },
    { to: '/projects', label: 'Projects', icon: 'mdi-code-braces' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
      padding: '0 24px',
      background: scrolled ? 'rgba(6,6,15,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(123,94,167,0.2)' : 'none',
      transition: 'all 0.4s ease',
      height: 70,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 900,
          fontSize: '1.1rem',
          background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: 2,
        }}>RKM</span>
      </Link>

      {/* Desktop Nav */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="desktop-nav">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            style={{
              textDecoration: 'none',
              padding: '8px 18px',
              borderRadius: 30,
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: 1,
              color: location.pathname === l.to ? '#00d4ff' : '#9090b0',
              background: location.pathname === l.to ? 'rgba(0,212,255,0.1)' : 'transparent',
              border: location.pathname === l.to ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
              transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <i className={`mdi ${l.icon}`} style={{ fontSize: 14 }} />
            {l.label}
          </Link>
        ))}
      </div>

      {/* Dev button */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {isDevMode ? (
          <button
            onClick={logout}
            style={{
              padding: '8px 18px',
              background: 'rgba(255,50,50,0.15)',
              border: '1px solid rgba(255,50,50,0.4)',
              borderRadius: 30,
              color: '#ff6b6b',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: 1,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <i className="mdi mdi-shield-off" />
            DEV MODE
          </button>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            style={{
              padding: '8px 16px',
              background: 'rgba(123,94,167,0.15)',
              border: '1px solid rgba(123,94,167,0.3)',
              borderRadius: 30,
              color: '#a855f7',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <i className="mdi mdi-shield-lock" />
            Dev
          </button>
        )}

        {/* Mobile menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', background: 'transparent', border: 'none',
            color: 'var(--text-primary)', fontSize: 24, cursor: 'pointer',
          }}
          className="mobile-menu-btn"
        >
          <i className={`mdi ${menuOpen ? 'mdi-close' : 'mdi-menu'}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 70, left: 0, right: 0,
          background: 'rgba(6,6,15,0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 8,
          zIndex: 998,
        }}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: 12,
                color: location.pathname === l.to ? '#00d4ff' : '#9090b0',
                background: location.pathname === l.to ? 'rgba(0,212,255,0.08)' : 'transparent',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: 15,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <i className={`mdi ${l.icon}`} />
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
