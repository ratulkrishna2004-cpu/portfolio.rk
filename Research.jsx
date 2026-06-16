import React from 'react';
import Footer from './Footer';

export default function Research() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 70, position: 'relative', zIndex: 1 }}>
      <div className="orb orb-1" />
      <div className="orb orb-3" />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--accent-cyan)', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>COMING SOON</p>
        <h1 className="section-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 20 }}>Research</h1>

        <div style={{ maxWidth: 500, margin: '60px auto', padding: 48 }} className="glass-card">
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(0,212,255,0.2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, color: 'var(--accent-cyan)',
            margin: '0 auto 20px',
            border: '1px solid rgba(0,212,255,0.3)',
            animation: 'pulse-glow 3s ease-in-out infinite',
          }}>
            <i className="mdi mdi-flask" />
          </div>
          <h3 style={{ fontFamily: 'Orbitron', color: 'var(--text-primary)', marginBottom: 12, fontSize: '1.1rem' }}>
            Research Section
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>
            Research papers, publications, and academic work will be showcased here soon. 
            Check back later for updates!
          </p>
          <div style={{ marginTop: 24, padding: '12px 20px', background: 'rgba(0,212,255,0.08)', borderRadius: 12, border: '1px solid rgba(0,212,255,0.2)', fontSize: 13, color: 'var(--accent-cyan)' }}>
            <i className="mdi mdi-trophy" style={{ marginRight: 8 }} />
            Champion – CS Congress Research Paper (2020)
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
