import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import Footer from './Footer';

const DEFAULT_CV = {
  driveLink: 'https://drive.google.com/file/d/YOUR_FILE_ID/preview',
  downloadLink: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID',
};

export default function CV() {
  const { isDevMode } = useAuth();
  const [cvConfig, setCvConfig] = useState(DEFAULT_CV);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(DEFAULT_CV);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'portfolio', 'cvConfig'), s => {
      if (s.exists()) setCvConfig(s.data());
    });
    return unsub;
  }, []);

  const save = async () => {
    await setDoc(doc(db, 'portfolio', 'cvConfig'), form);
    setCvConfig(form);
    setShowModal(false);
  };

  const isValidLink = cvConfig.driveLink && !cvConfig.driveLink.includes('YOUR_FILE_ID');

  return (
    <div style={{ minHeight: '100vh', paddingTop: 70, position: 'relative', zIndex: 1 }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ color: 'var(--accent-cyan)', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>MY RESUME</p>
          <h1 className="section-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>Curriculum Vitae</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>View my full resume below</p>
        </div>

        {/* CV Viewer */}
        <div className="glass-card" style={{ padding: 4, marginBottom: 24, overflow: 'hidden' }}>
          {isValidLink ? (
            <iframe
              src={cvConfig.driveLink}
              style={{ width: '100%', height: '80vh', border: 'none', borderRadius: 14 }}
              title="CV"
              allow="autoplay"
            />
          ) : (
            <div style={{
              height: '60vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              color: 'var(--text-muted)',
            }}>
              <i className="mdi mdi-file-pdf-box" style={{ fontSize: 60, color: 'var(--accent-electric)' }} />
              <p style={{ fontSize: 16 }}>CV not configured yet</p>
              {isDevMode && (
                <button className="btn-add" onClick={() => { setForm(cvConfig); setShowModal(true); }}>
                  <i className="mdi mdi-link-variant" /> Set CV Drive Link
                </button>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          {cvConfig.downloadLink && !cvConfig.downloadLink.includes('YOUR_FILE_ID') && (
            <a
              href={cvConfig.downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-design"
            >
              <i className="mdi mdi-download" /> Download CV
            </a>
          )}
          {isDevMode && (
            <button className="btn-add" onClick={() => { setForm(cvConfig); setShowModal(true); }}>
              <i className="mdi mdi-cog" /> Edit CV Links
            </button>
          )}
        </div>
      </div>

      <Footer />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>📄 CV Settings</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
              Upload your CV to Google Drive, then:<br />
              1. Share → Anyone with link can view<br />
              2. Copy the link ID (the long string between /d/ and /view)<br />
              3. Paste below
            </p>
            <label className="form-label">Google Drive Preview Link</label>
            <input className="form-input" placeholder="https://drive.google.com/file/d/ID/preview" value={form.driveLink} onChange={e => setForm(f => ({ ...f, driveLink: e.target.value }))} />
            <label className="form-label">Google Drive Download Link</label>
            <input className="form-input" placeholder="https://drive.google.com/uc?export=download&id=ID" value={form.downloadLink} onChange={e => setForm(f => ({ ...f, downloadLink: e.target.value }))} />
            <button className="btn-save" onClick={save}><i className="mdi mdi-content-save" /> Save</button>
            <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
