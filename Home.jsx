import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import IconSearch from './IconSearch';
import Footer from './Footer';

const GITHUB_RAW = 'https://raw.githubusercontent.com/'; // user fills in their repo

const DEFAULT_EDUCATION = [
  { id: '1', institution: 'Ahsanullah University of Science & Technology (AUST)', degree: 'B.Sc. in Electrical and Electronic Engineering (EEE)', year: '2024 – Present', icon: 'mdi-school', grade: '' },
  { id: '2', institution: 'Notre Dame College, Dhaka', degree: 'Higher Secondary Certificate (HSC)', year: '2023', icon: 'mdi-graduation-cap', grade: 'GPA: 5.00' },
  { id: '3', institution: 'Narayanganj Ideal School', degree: 'Secondary School Certificate (SSC)', year: '2021', icon: 'mdi-book-open-variant', grade: 'GPA: 5.00' },
];

const DEFAULT_AWARDS = [
  { id: 'a1', title: 'Champion – CS Congress Research Paper', year: '2020', icon: 'mdi-trophy', category: 'Science & Research' },
  { id: 'a2', title: 'Champion – BDPHO Regional Round', year: '2020', icon: 'mdi-atom', category: 'Science & Research' },
  { id: 'a3', title: '4th Place – 4th National Space Carnival', year: '', icon: 'mdi-rocket', category: 'Science & Research' },
  { id: 'a4', title: 'Champion – SJC Math Mania', year: '2020', icon: 'mdi-math-integral', category: 'Science & Research' },
  { id: 'a5', title: 'Champion – HCC Science Fest', year: '2022', icon: 'mdi-flask', category: 'Science & Research' },
  { id: 'a6', title: '3rd Place – HCC Science Fest', year: '2023', icon: 'mdi-flask', category: 'Science & Research' },
  { id: 'a7', title: 'Champion – NDC National Space & Eco Fest', year: '2023', icon: 'mdi-earth', category: 'Science & Research' },
  { id: 'a8', title: '3rd Place – 3rd National Science Fest', year: '2023', icon: 'mdi-podium', category: 'Science & Research' },
  { id: 'a9', title: 'Champion – BUET National Environmental Carnival', year: '2023', icon: 'mdi-leaf', category: 'Science & Research' },
  { id: 'a10', title: 'Bronze Honor – International Astronomy Olympiad', year: '2023', icon: 'mdi-telescope', category: 'Science & Research' },
  { id: 'a11', title: '2nd Place – Singing, District Level', year: '2015', icon: 'mdi-microphone', category: 'Cultural' },
  { id: 'a12', title: '3 Awards – Bangladesh Shishu Academy', year: '', icon: 'mdi-music', category: 'Cultural' },
  { id: 'a13', title: '4 Awards – BAFA', year: '', icon: 'mdi-music-note', category: 'Cultural' },
  { id: 'a14', title: 'Champion – Thana & Upzila Level Singing', year: '2015', icon: 'mdi-trophy', category: 'Cultural' },
  { id: 'a15', title: 'Ranked 61st – 13th National Archery Championship', year: '', icon: 'mdi-bow-arrow', category: 'Sports' },
];

const DEFAULT_PHOTO_CONFIG = { githubUser: 'YOUR_GITHUB_USERNAME', repo: 'YOUR_REPO', branch: 'main', file: 'Ratul.jpeg', x: 0, y: 0, scale: 1 };

export default function Home() {
  const { isDevMode } = useAuth();
  const [photoConfig, setPhotoConfig] = useState(DEFAULT_PHOTO_CONFIG);
  const [education, setEducation] = useState(DEFAULT_EDUCATION);
  const [awards, setAwards] = useState(DEFAULT_AWARDS);

  // Photo editor state
  const [photoEditing, setPhotoEditing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tempPos, setTempPos] = useState({ x: 0, y: 0, scale: 1 });

  // Modals
  const [showEduModal, setShowEduModal] = useState(false);
  const [editEdu, setEditEdu] = useState(null);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [editAward, setEditAward] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Forms
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', year: '', icon: 'mdi-school', grade: '' });
  const [awardForm, setAwardForm] = useState({ title: '', year: '', icon: 'mdi-trophy', category: '' });

  useEffect(() => {
    const unsub1 = onSnapshot(doc(db, 'portfolio', 'photoConfig'), s => { if (s.exists()) { setPhotoConfig(s.data()); setTempPos({ x: s.data().x || 0, y: s.data().y || 0, scale: s.data().scale || 1 }); } });
    const unsub2 = onSnapshot(doc(db, 'portfolio', 'education'), s => { if (s.exists()) setEducation(s.data().list || DEFAULT_EDUCATION); });
    const unsub3 = onSnapshot(doc(db, 'portfolio', 'awards'), s => { if (s.exists()) setAwards(s.data().list || DEFAULT_AWARDS); });
    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  // Photo URL
  const photoUrl = photoConfig.githubUser && photoConfig.githubUser !== 'YOUR_GITHUB_USERNAME'
    ? `${GITHUB_RAW}${photoConfig.githubUser}/${photoConfig.repo}/${photoConfig.branch}/${photoConfig.file}`
    : null;

  // Drag handlers
  const handleMouseDown = (e) => {
    if (!photoEditing) return;
    setDragging(true);
    setDragStart({ x: e.clientX - tempPos.x, y: e.clientY - tempPos.y });
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    setTempPos(p => ({ ...p, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }));
  };
  const handleMouseUp = () => setDragging(false);

  const handleTouchStart = (e) => {
    if (!photoEditing) return;
    const t = e.touches[0];
    setDragging(true);
    setDragStart({ x: t.clientX - tempPos.x, y: t.clientY - tempPos.y });
  };
  const handleTouchMove = (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    setTempPos(p => ({ ...p, x: t.clientX - dragStart.x, y: t.clientY - dragStart.y }));
  };

  const savePhoto = async () => {
    const updated = { ...photoConfig, ...tempPos };
    await setDoc(doc(db, 'portfolio', 'photoConfig'), updated);
    setPhotoConfig(updated);
    setPhotoEditing(false);
  };

  // Education CRUD
  const openAddEdu = () => {
    setEduForm({ institution: '', degree: '', year: '', icon: 'mdi-school', grade: '' });
    setEditEdu('new');
    setShowEduModal(true);
  };
  const openEditEdu = (e) => {
    setEduForm({ institution: e.institution, degree: e.degree, year: e.year, icon: e.icon, grade: e.grade || '' });
    setEditEdu(e.id);
    setShowEduModal(true);
  };
  const saveEdu = async () => {
    let list;
    if (editEdu === 'new') list = [{ ...eduForm, id: Date.now().toString() }, ...education];
    else list = education.map(e => e.id === editEdu ? { ...e, ...eduForm } : e);
    await setDoc(doc(db, 'portfolio', 'education'), { list });
    setShowEduModal(false);
  };
  const delEdu = async (id) => {
    if (!window.confirm('Delete?')) return;
    await setDoc(doc(db, 'portfolio', 'education'), { list: education.filter(e => e.id !== id) });
  };

  // Awards CRUD
  const openAddAward = () => {
    setAwardForm({ title: '', year: '', icon: 'mdi-trophy', category: '' });
    setEditAward('new');
    setShowAwardModal(true);
  };
  const openEditAward = (a) => {
    setAwardForm({ title: a.title, year: a.year, icon: a.icon, category: a.category || '' });
    setEditAward(a.id);
    setShowAwardModal(true);
  };
  const saveAward = async () => {
    let list;
    if (editAward === 'new') list = [{ ...awardForm, id: Date.now().toString() }, ...awards];
    else list = awards.map(a => a.id === editAward ? { ...a, ...awardForm } : a);
    await setDoc(doc(db, 'portfolio', 'awards'), { list });
    setShowAwardModal(false);
  };
  const delAward = async (id) => {
    if (!window.confirm('Delete?')) return;
    await setDoc(doc(db, 'portfolio', 'awards'), { list: awards.filter(a => a.id !== id) });
  };

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ===== HERO ===== */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 40px 60px',
        position: 'relative',
      }}>
        <div style={{
          maxWidth: 1100,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'center',
        }}>
          {/* Left: Text */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              background: 'rgba(79,70,229,0.15)',
              border: '1px solid rgba(79,70,229,0.3)',
              borderRadius: 30,
              fontSize: 12,
              color: '#a855f7',
              fontWeight: 600,
              letterSpacing: 2,
              marginBottom: 24,
              textTransform: 'uppercase',
            }}>
              <i className="mdi mdi-lightning-bolt" />
              EEE Student · AUST
            </div>

            <h1 style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 8,
            }}>
              <span style={{ color: 'var(--text-primary)' }}>Ratul</span><br />
              <span style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, #7b5ea7 50%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Krishna</span><br />
              <span style={{ color: 'var(--text-primary)' }}>Mojumder</span>
            </h1>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: 15,
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 420,
            }}>
              Passionate engineer, science Olympiad mentor, graphics designer, singer & archer. 
              Building the future with circuits and creativity. 🔌
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#skills-section" className="btn-design" style={{ textDecoration: 'none' }}>
                <i className="mdi mdi-lightning-bolt" />
                Design
              </a>
              <a href="/cv" className="btn-cv" style={{ textDecoration: 'none' }}>
                <i className="mdi mdi-file-account" />
                CV
              </a>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'flex', gap: 28, marginTop: 40, flexWrap: 'wrap' }}>
              {[
                { num: '15+', label: 'Awards' },
                { num: '5', label: 'Clubs' },
                { num: '5.0', label: 'GPA' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.8rem', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Photo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{
              position: 'relative',
              width: 320, height: 320,
              animation: 'float 4s ease-in-out infinite',
            }}>
              {/* Glow ring */}
              <div style={{
                position: 'absolute', inset: -4,
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #00d4ff, #7b5ea7, #a855f7, #4f46e5, #00d4ff)',
                animation: 'spin 6s linear infinite',
                zIndex: 0,
              }} />
              <div style={{
                position: 'absolute', inset: 2,
                borderRadius: '50%',
                background: 'var(--bg-deep)',
                zIndex: 1,
              }} />
              {/* Photo */}
              <div
                style={{
                  position: 'absolute', inset: 6,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  zIndex: 2,
                  background: 'linear-gradient(135deg, #1a1a3e, #0d0d1f)',
                  cursor: photoEditing ? (dragging ? 'grabbing' : 'grab') : 'default',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Ratul"
                    draggable={false}
                    style={{
                      position: 'absolute',
                      width: `${tempPos.scale * 100}%`,
                      height: `${tempPos.scale * 100}%`,
                      objectFit: 'cover',
                      left: `calc(50% + ${tempPos.x}px)`,
                      top: `calc(50% + ${tempPos.y}px)`,
                      transform: 'translate(-50%, -50%)',
                      userSelect: 'none',
                      transition: dragging ? 'none' : 'all 0.2s',
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <i className="mdi mdi-account" style={{ fontSize: 80, color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '0 20px' }}>Add photo via Dev settings</span>
                  </div>
                )}
              </div>
            </div>

            {/* Photo controls in dev mode */}
            {isDevMode && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {!photoEditing ? (
                  <>
                    <button className="btn-add" onClick={() => { setPhotoEditing(true); setTempPos({ x: photoConfig.x || 0, y: photoConfig.y || 0, scale: photoConfig.scale || 1 }); }}>
                      <i className="mdi mdi-image-edit" /> Edit Photo
                    </button>
                    <button className="btn-add" onClick={() => setShowPhotoModal(true)}>
                      <i className="mdi mdi-cog" /> Photo Settings
                    </button>
                  </>
                ) : (
                  <>
                    <button style={{ ...{}, background: 'rgba(79,70,229,0.2)', border: '1px solid rgba(79,70,229,0.5)', borderRadius: 10, color: '#a855f7', padding: '8px 12px', cursor: 'pointer', fontSize: 13 }}
                      onClick={() => setTempPos(p => ({ ...p, scale: Math.min(p.scale + 0.1, 3) }))}>
                      <i className="mdi mdi-magnify-plus" /> Zoom In
                    </button>
                    <button style={{ background: 'rgba(79,70,229,0.2)', border: '1px solid rgba(79,70,229,0.5)', borderRadius: 10, color: '#a855f7', padding: '8px 12px', cursor: 'pointer', fontSize: 13 }}
                      onClick={() => setTempPos(p => ({ ...p, scale: Math.max(p.scale - 0.1, 0.3) }))}>
                      <i className="mdi mdi-magnify-minus" /> Zoom Out
                    </button>
                    <button className="btn-save" style={{ padding: '8px 16px', marginTop: 0, width: 'auto', borderRadius: 10 }} onClick={savePhoto}>
                      <i className="mdi mdi-content-save" /> Save
                    </button>
                    <button className="btn-cancel" style={{ padding: '8px 16px', marginTop: 0, width: 'auto', borderRadius: 10 }} onClick={() => setPhotoEditing(false)}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
          @media (max-width: 768px) {
            section > div { grid-template-columns: 1fr !important; }
            section > div > div:last-child { order: -1; }
            section > div > div > div[style*="320px"] { width: 240px !important; height: 240px !important; }
          }
        `}</style>
      </section>

      {/* ===== EDUCATION ===== */}
      <section id="skills-section" style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ color: 'var(--accent-cyan)', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>ACADEMIC JOURNEY</p>
            <h2 className="section-title">Education</h2>
          </div>
          {isDevMode && <button className="btn-add" onClick={openAddEdu}><i className="mdi mdi-plus-circle" /> Add Education</button>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {education.map((e, i) => (
            <div key={e.id} className="glass-card" style={{ padding: '24px 28px', display: 'flex', gap: 20, alignItems: 'flex-start', position: 'relative', overflow: 'hidden' }}>
              {/* Timeline dot */}
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(0,212,255,0.2))',
                border: '1px solid rgba(0,212,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: 'var(--accent-cyan)',
              }}>
                <i className={`mdi ${e.icon}`} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{e.institution}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{e.degree}</p>
                    {e.grade && <p style={{ color: 'var(--accent-cyan)', fontSize: 13, marginTop: 4, fontWeight: 600 }}>{e.grade}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{
                      padding: '4px 14px',
                      background: 'rgba(79,70,229,0.15)',
                      border: '1px solid rgba(79,70,229,0.3)',
                      borderRadius: 20,
                      fontSize: 12,
                      color: '#a855f7',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}>{e.year}</span>
                    {isDevMode && (
                      <>
                        <button onClick={() => openEditEdu(e)} style={{ background: 'rgba(0,212,255,0.1)', border: 'none', borderRadius: 8, color: 'var(--accent-cyan)', cursor: 'pointer', padding: '6px 8px', fontSize: 14 }}><i className="mdi mdi-pencil" /></button>
                        <button onClick={() => delEdu(e.id)} style={{ background: 'rgba(255,80,80,0.1)', border: 'none', borderRadius: 8, color: '#ff6b6b', cursor: 'pointer', padding: '6px 8px', fontSize: 14 }}><i className="mdi mdi-delete" /></button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* Decorative */}
              <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.05), transparent)', pointerEvents: 'none' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ===== AWARDS ===== */}
      <section style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ color: 'var(--accent-cyan)', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>ACHIEVEMENTS</p>
            <h2 className="section-title">Awards & Honours</h2>
          </div>
          {isDevMode && <button className="btn-add" onClick={openAddAward}><i className="mdi mdi-plus-circle" /> Add Award</button>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {awards.map((a, i) => (
            <div key={a.id} className="glass-card" style={{ padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(79,70,229,0.2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, color: '#a855f7',
                border: '1px solid rgba(168,85,247,0.2)',
              }}>
                <i className={`mdi ${a.icon}`} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.4, color: 'var(--text-primary)' }}>{a.title}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  {a.year && <span style={{ fontSize: 11, color: '#a855f7', background: 'rgba(168,85,247,0.1)', padding: '2px 8px', borderRadius: 8 }}>{a.year}</span>}
                  {a.category && <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: 8 }}>{a.category}</span>}
                </div>
              </div>
              {isDevMode && (
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button onClick={() => openEditAward(a)} style={{ background: 'rgba(0,212,255,0.1)', border: 'none', borderRadius: 8, color: 'var(--accent-cyan)', cursor: 'pointer', padding: '5px 7px', fontSize: 13 }}><i className="mdi mdi-pencil" /></button>
                  <button onClick={() => delAward(a.id)} style={{ background: 'rgba(255,80,80,0.1)', border: 'none', borderRadius: 8, color: '#ff6b6b', cursor: 'pointer', padding: '5px 7px', fontSize: 13 }}><i className="mdi mdi-delete" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {/* Photo Settings Modal */}
      {showPhotoModal && (
        <div className="modal-overlay" onClick={() => setShowPhotoModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>📸 Photo Settings</h3>
            <label className="form-label">GitHub Username</label>
            <input className="form-input" placeholder="your-username" value={photoConfig.githubUser || ''} onChange={e => setPhotoConfig(p => ({ ...p, githubUser: e.target.value }))} />
            <label className="form-label">Repository Name</label>
            <input className="form-input" placeholder="portfolio" value={photoConfig.repo || ''} onChange={e => setPhotoConfig(p => ({ ...p, repo: e.target.value }))} />
            <label className="form-label">Branch</label>
            <input className="form-input" placeholder="main" value={photoConfig.branch || 'main'} onChange={e => setPhotoConfig(p => ({ ...p, branch: e.target.value }))} />
            <label className="form-label">Image Filename</label>
            <input className="form-input" placeholder="Ratul.jpeg" value={photoConfig.file || ''} onChange={e => setPhotoConfig(p => ({ ...p, file: e.target.value }))} />
            <button className="btn-save" onClick={async () => { await setDoc(doc(db, 'portfolio', 'photoConfig'), { ...photoConfig, x: tempPos.x, y: tempPos.y, scale: tempPos.scale }); setShowPhotoModal(false); }}>
              <i className="mdi mdi-content-save" /> Save
            </button>
            <button className="btn-cancel" onClick={() => setShowPhotoModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {showEduModal && (
        <div className="modal-overlay" onClick={() => setShowEduModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>✦ {editEdu === 'new' ? 'Add Education' : 'Edit Education'}</h3>
            <IconSearch value={eduForm.icon} onChange={icon => setEduForm(f => ({ ...f, icon }))} />
            <label className="form-label">Institution Name</label>
            <input className="form-input" placeholder="University / College / School" value={eduForm.institution} onChange={e => setEduForm(f => ({ ...f, institution: e.target.value }))} />
            <label className="form-label">Degree / Certificate</label>
            <input className="form-input" placeholder="e.g. B.Sc. in EEE" value={eduForm.degree} onChange={e => setEduForm(f => ({ ...f, degree: e.target.value }))} />
            <label className="form-label">Year</label>
            <input className="form-input" placeholder="e.g. 2024 – Present" value={eduForm.year} onChange={e => setEduForm(f => ({ ...f, year: e.target.value }))} />
            <label className="form-label">Grade (optional)</label>
            <input className="form-input" placeholder="e.g. GPA: 5.00" value={eduForm.grade} onChange={e => setEduForm(f => ({ ...f, grade: e.target.value }))} />
            <button className="btn-save" onClick={saveEdu}><i className="mdi mdi-content-save" /> Save</button>
            <button className="btn-cancel" onClick={() => setShowEduModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Award Modal */}
      {showAwardModal && (
        <div className="modal-overlay" onClick={() => setShowAwardModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>✦ {editAward === 'new' ? 'Add Award' : 'Edit Award'}</h3>
            <IconSearch value={awardForm.icon} onChange={icon => setAwardForm(f => ({ ...f, icon }))} />
            <label className="form-label">Award Title</label>
            <input className="form-input" placeholder="e.g. Champion – Science Fest" value={awardForm.title} onChange={e => setAwardForm(f => ({ ...f, title: e.target.value }))} />
            <label className="form-label">Year (optional)</label>
            <input className="form-input" placeholder="e.g. 2023" value={awardForm.year} onChange={e => setAwardForm(f => ({ ...f, year: e.target.value }))} />
            <label className="form-label">Category (optional)</label>
            <input className="form-input" placeholder="e.g. Science & Research" value={awardForm.category} onChange={e => setAwardForm(f => ({ ...f, category: e.target.value }))} />
            <button className="btn-save" onClick={saveAward}><i className="mdi mdi-content-save" /> Save</button>
            <button className="btn-cancel" onClick={() => setShowAwardModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
