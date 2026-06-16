import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export default function LoginModal() {
  const { login, setShowLogin } = useAuth();
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (login(pass)) {
      setPass('');
      setError('');
    } else {
      setError('Wrong password!');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowLogin(false)}>
      <div
        className="modal-box"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 380,
          animation: shake ? 'shake 0.4s ease' : 'slideUp 0.3s ease',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(0,212,255,0.2))',
            border: '2px solid rgba(0,212,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 28, color: 'var(--accent-cyan)',
            boxShadow: '0 0 30px rgba(0,212,255,0.2)',
          }}>
            <i className="mdi mdi-shield-lock" />
          </div>
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--accent-cyan)', fontSize: '1.1rem', letterSpacing: 2 }}>
            DEV ACCESS
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
            Enter password to edit portfolio
          </p>
        </div>

        <input
          className="form-input"
          type="password"
          placeholder="Enter password..."
          value={pass}
          onChange={e => { setPass(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          autoFocus
          style={{ textAlign: 'center', fontSize: 18, letterSpacing: 4 }}
        />

        {error && (
          <p style={{ color: '#ff6b6b', fontSize: 13, textAlign: 'center', marginBottom: 10 }}>
            <i className="mdi mdi-alert-circle" /> {error}
          </p>
        )}

        <button className="btn-save" onClick={handleLogin}>
          <i className="mdi mdi-login" /> Login
        </button>
        <button className="btn-cancel" onClick={() => setShowLogin(false)}>
          Cancel
        </button>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) }
          20% { transform: translateX(-10px) }
          40% { transform: translateX(10px) }
          60% { transform: translateX(-10px) }
          80% { transform: translateX(8px) }
        }
      `}</style>
    </div>
  );
}
