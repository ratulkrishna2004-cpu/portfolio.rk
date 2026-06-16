import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import IconSearch from './IconSearch';
import Footer from './Footer';

const DEFAULT_SKILLS = [
  { id: 's1', name: 'C / C++', icon: 'mdi-language-cpp', level: 80 },
  { id: 's2', name: 'Microsoft Office (Expert)', icon: 'mdi-microsoft', level: 95 },
  { id: 's3', name: 'Canva & Graphics Design', icon: 'mdi-palette', level: 85 },
  { id: 's4', name: 'Quartus II', icon: 'mdi-chip', level: 70 },
  { id: 's5', name: 'LTSpice', icon: 'mdi-sine-wave', level: 70 },
  { id: 's6', name: 'Google Workspace', icon: 'mdi-google', level: 90 },
  { id: 's7', name: 'Event Management', icon: 'mdi-calendar-star', level: 88 },
  { id: 's8', name: 'Data Handling', icon: 'mdi-database', level: 82 },
  { id: 's9', name: 'Leadership', icon: 'mdi-account-star', level: 92 },
  { id: 's10', name: 'Public Speaking', icon: 'mdi-microphone', level: 85 },
];

const DEFAULT_SWITCHES = [
  { id: 'sw1', name: 'GitHub', icon: 'mdi-github', link: 'https://github.com/' },
  { id: 'sw2', name: 'LinkedIn', icon: 'mdi-linkedin', link: 'https://www.linkedin.com/in/ratul-krishna-b09i24/' },
  { id: 'sw3', name: 'IEEE AUST', icon: 'mdi-chip', link: '' },
];

export default function Skills() {
  const { isDevMode } = useAuth();
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [switches, setSwitches] = useState(DEFAULT_SWITCHES);

  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editSkill, setEditSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: '', icon: 'mdi-star', level: 80 });

  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [editSwitch, setEditSwitch] = useState(null);
  const [switchForm, setSwitchForm] = useState({ name: '', icon: 'mdi-web', link: '' });

  useEffect(() => {
    const u1 = onSnapshot(doc(db, 'portfolio', 'skills'), s => { if (s.exists()) setSkills(s.data().list || DEFAULT_SKILLS); });
    const u2 = onSnapshot(doc(db, 'portfolio', 'switches'), s => { if (s.exists()) setSwitches(s.data().list || DEFAULT_SWITCHES); });
    return () => { u1(); u2(); };
  }, []);

  // Skills CRUD
  const openAddSkill = () => { setSkillForm({ name: '', icon: 'mdi-star', level: 80 }); setEditSkill('new'); setShowSkillModal(true); };
  const openEditSkill = (s) => { setSkillForm({ name: s.name, icon: s.icon, level: s.level }); setEditSkill(s.id); setShowSkillModal(true); };
  const saveSkill = async () => {
    let list = editSkill === 'new'
      ? [{ ...skillForm, id: Date.now().toString() }, ...skills]
      : skills.map(s => s.id === editSkill ? { ...s, ...skillForm } : s);
    await setDoc(doc(db, 'portfolio', 'skills'), { list });
    setShowSkillModal(false);
  };
  const delSkill = async (id) => {
    if (!window.confirm('Delete?')) return;
    await setDoc(doc(db, 'portfolio', 'skills'), { list: skills.filter(s => s.id !== id) });
  };

  // Switches CRUD
  const openAddSwitch = () => { setSwitchForm({ name: '', icon: 'mdi-web', link: '' }); setEditSwitch('new'); setShowSwitchModal(true); };
  const openEditSwitch = (s) => { setSwitchForm({ name: s.name, icon: s.icon, link: s.link }); setEditSwitch(s.id); setShowSwitchModal(true); };
  const saveSwitch = async () => {
    let list = editSwitch === 'new'
      ? [{ ...switchForm, id: Date.now().toString() }, ...switches]
      : switches.map(s => s.id === editSwitch ? { ...s, ...switchForm } : s);
    await setDoc(doc(db, 'portfolio', 'switches'), { list });
    setShowSwitchModal(false);
  };
  const delSwitch = async (id) => {
    if (!window.confirm('Delete?')) return;
    await setDoc(doc(db, 'portfolio', 'switches'), { list: switches.filter(s => s.id !== id) });
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 70, position: 'relative', zIndex: 1 }}>
      <div className="orb orb-1" />
      <div className="orb orb-3" />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ color: 'var(--accent-cyan)', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>WHAT I KNOW</p>
          <h1 className="section-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>Skills & Expertise</h1>
        </div>

        {/* Switches / Links */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <h2 style={{ fontFamily: 'Orbitron', color: 'var(--text-primary)', fontSize: '1.1rem', letterSpacing: 1 }}>
              <i className="mdi mdi-link-variant" style={{ color: 'var(--accent-cyan)', marginRight: 8 }} />Quick Links
            </h2>
            {isDevMode && <button className="btn-add" onClick={openAddSwitch}><i className="mdi mdi-plus-circle" /> Add Link</button>}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {switches.map(sw => (
              <div key={sw.id} style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
                <a
                  href={sw.link || '#'}
                  target={sw.link ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="glass-card"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '12px 20px', textDecoration: 'none',
                    color: 'var(--text-primary)',
                    borderRadius: 30,
                    fontWeight: 600, fontSize: 14,
                    transition: 'all 0.3s',
                  }}
                >
                  <i className={`mdi ${sw.icon}`} style={{ fontSize: 18, color: 'var(--accent-cyan)' }} />
                  {sw.name}
                  {sw.link && <i className="mdi mdi-open-in-new" style={{ fontSize: 12, color: 'var(--text-muted)' }} />}
                </a>
                {isDevMode && (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => openEditSwitch(sw)} style={{ background: 'rgba(0,212,255,0.1)', border: 'none', borderRadius: 8, color: 'var(--accent-cyan)', cursor: 'pointer', padding: '6px 8px', fontSize: 13 }}><i className="mdi mdi-pencil" /></button>
                    <button onClick={() => delSwitch(sw.id)} style={{ background: 'rgba(255,80,80,0.1)', border: 'none', borderRadius: 8, color: '#ff6b6b', cursor: 'pointer', padding: '6px 8px', fontSize: 13 }}><i className="mdi mdi-delete" /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
          <h2 style={{ fontFamily: 'Orbitron', color: 'var(--text-primary)', fontSize: '1.1rem', letterSpacing: 1 }}>
            <i className="mdi mdi-lightning-bolt" style={{ color: 'var(--accent-cyan)', marginRight: 8 }} />Technical Skills
          </h2>
          {isDevMode && <button className="btn-add" onClick={openAddSkill}><i className="mdi mdi-plus-circle" /> Add Skill</button>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {skills.map(s => (
            <div key={s.id} className="glass-card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(0,212,255,0.2))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, color: 'var(--accent-cyan)',
                    border: '1px solid rgba(0,212,255,0.2)',
                  }}>
                    <i className={`mdi ${s.icon}`} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Orbitron', fontSize: 13, color: 'var(--accent-cyan)', fontWeight: 700 }}>{s.level}%</span>
                  {isDevMode && (
                    <>
                      <button onClick={() => openEditSkill(s)} style={{ background: 'rgba(0,212,255,0.1)', border: 'none', borderRadius: 8, color: 'var(--accent-cyan)', cursor: 'pointer', padding: '5px 7px', fontSize: 12 }}><i className="mdi mdi-pencil" /></button>
                      <button onClick={() => delSkill(s.id)} style={{ background: 'rgba(255,80,80,0.1)', border: 'none', borderRadius: 8, color: '#ff6b6b', cursor: 'pointer', padding: '5px 7px', fontSize: 12 }}><i className="mdi mdi-delete" /></button>
                    </>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${s.level}%`,
                  background: 'linear-gradient(90deg, #4f46e5, #00d4ff)',
                  borderRadius: 10,
                  boxShadow: '0 0 10px rgba(0,212,255,0.4)',
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      {/* Skill Modal */}
      {showSkillModal && (
        <div className="modal-overlay" onClick={() => setShowSkillModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>✦ {editSkill === 'new' ? 'Add Skill' : 'Edit Skill'}</h3>
            <IconSearch value={skillForm.icon} onChange={icon => setSkillForm(f => ({ ...f, icon }))} />
            <label className="form-label">Skill Name</label>
            <input className="form-input" placeholder="e.g. Python, Canva" value={skillForm.name} onChange={e => setSkillForm(f => ({ ...f, name: e.target.value }))} />
            <label className="form-label">Proficiency Level: {skillForm.level}%</label>
            <input type="range" min="10" max="100" value={skillForm.level} onChange={e => setSkillForm(f => ({ ...f, level: parseInt(e.target.value) }))}
              style={{ width: '100%', marginBottom: 14, accentColor: 'var(--accent-cyan)' }} />
            <button className="btn-save" onClick={saveSkill}><i className="mdi mdi-content-save" /> Save</button>
            <button className="btn-cancel" onClick={() => setShowSkillModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Switch Modal */}
      {showSwitchModal && (
        <div className="modal-overlay" onClick={() => setShowSwitchModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>✦ {editSwitch === 'new' ? 'Add Link' : 'Edit Link'}</h3>
            <IconSearch value={switchForm.icon} onChange={icon => setSwitchForm(f => ({ ...f, icon }))} />
            <label className="form-label">Name</label>
            <input className="form-input" placeholder="e.g. GitHub, Portfolio" value={switchForm.name} onChange={e => setSwitchForm(f => ({ ...f, name: e.target.value }))} />
            <label className="form-label">URL</label>
            <input className="form-input" placeholder="https://..." value={switchForm.link} onChange={e => setSwitchForm(f => ({ ...f, link: e.target.value }))} />
            <button className="btn-save" onClick={saveSwitch}><i className="mdi mdi-content-save" /> Save</button>
            <button className="btn-cancel" onClick={() => setShowSwitchModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
