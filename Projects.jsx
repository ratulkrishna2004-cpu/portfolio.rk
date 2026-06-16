import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import IconSearch from './IconSearch';
import Footer from './Footer';

const GITHUB_RAW = 'https://raw.githubusercontent.com/';
const PROJECT_TYPES = ['Web App', 'Circuit Design', 'Embedded System', 'Research', 'IoT', 'Machine Learning', 'Mobile App', 'Other'];

const DEFAULT_PROJECTS = [];

export default function Projects() {
  const { isDevMode } = useAuth();
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '', type: 'Circuit Design', description: '',
    link: '', githubImageFile: '', icon: 'mdi-code-braces',
    hasLink: true, hasText: true, hasImage: false,
  });
  const [githubSettings, setGithubSettings] = useState({ user: '', repo: '', branch: 'main' });

  useEffect(() => {
    const u1 = onSnapshot(doc(db, 'portfolio', 'projects'), s => { if (s.exists()) setProjects(s.data().list || []); });
    const u2 = onSnapshot(doc(db, 'portfolio', 'githubSettings'), s => { if (s.exists()) setGithubSettings(s.data()); });
    return () => { u1(); u2(); };
  }, []);

  const openAdd = () => {
    setForm({ name: '', type: 'Circuit Design', description: '', link: '', githubImageFile: '', icon: 'mdi-code-braces', hasLink: true, hasText: true, hasImage: false });
    setEditId('new');
    setShowModal(true);
  };
  const openEdit = (p) => {
    setForm({ ...p });
    setEditId(p.id);
    setShowModal(true);
  };
  const save = async () => {
    let list;
    if (editId === 'new') list = [{ ...form, id: Date.now().toString() }, ...projects];
    else list = projects.map(p => p.id === editId ? { ...p, ...form } : p);
    await setDoc(doc(db, 'portfolio', 'projects'), { list });
    setShowModal(false);
  };
  const del = async (id) => {
    if (!window.confirm('Delete project?')) return;
    await setDoc(doc(db, 'portfolio', 'projects'), { list: projects.filter(p => p.id !== id) });
  };

  const getImageUrl = (filename) => {
    if (!filename || !githubSettings.user) return null;
    return `${GITHUB_RAW}${githubSettings.user}/${githubSettings.repo}/${githubSettings.branch}/${filename}`;
  };

  const typeColors = {
    'Circuit Design': '#4f46e5', 'Embedded System': '#00d4ff', 'Web App': '#a855f7',
    'Research': '#f59e0b', 'IoT': '#10b981', 'Machine Learning': '#ef4444',
    'Mobile App': '#8b5cf6', 'Other': '#6b7280',
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 70, position: 'relative', zIndex: 1 }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ color: 'var(--accent-cyan)', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>WHAT I'VE BUILT</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>Projects</h1>
          </div>
          {isDevMode && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn-add" onClick={openAdd}>
                <i className="mdi mdi-plus-circle" /> Add Project
              </button>
              <button className="btn-add" onClick={async () => {
                const u = prompt('GitHub Username:');
                const r = prompt('Repository Name:');
                const b = prompt('Branch (default: main):') || 'main';
                if (u && r) { await setDoc(doc(db, 'portfolio', 'githubSettings'), { user: u, repo: r, branch: b }); }
              }}>
                <i className="mdi mdi-github" /> GitHub Settings
              </button>
            </div>
          )}
        </div>

        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <i className="mdi mdi-rocket-launch-outline" style={{ fontSize: 64, display: 'block', marginBottom: 16, color: 'var(--accent-electric)' }} />
            <p style={{ fontSize: 16, marginBottom: 8 }}>No projects yet</p>
            {isDevMode ? (
              <p style={{ fontSize: 14 }}>Click "Add Project" to add your first project!</p>
            ) : (
              <p style={{ fontSize: 14 }}>Projects coming soon...</p>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {projects.map(p => {
              const imgUrl = p.hasImage && p.githubImageFile ? getImageUrl(p.githubImageFile) : null;
              const color = typeColors[p.type] || '#6b7280';
              return (
                <div key={p.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Project image */}
                  {imgUrl && (
                    <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                      <img src={imgUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6))' }} />
                    </div>
                  )}
                  {!imgUrl && (
                    <div style={{
                      height: 100,
                      background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                      borderBottom: `1px solid ${color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 40, color: color,
                    }}>
                      <i className={`mdi ${p.icon}`} />
                    </div>
                  )}

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 8 }}>
                      <h3 style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.3 }}>{p.name}</h3>
                      <span style={{
                        fontSize: 10, padding: '3px 10px', borderRadius: 20, fontWeight: 700,
                        background: `${color}22`, color: color, border: `1px solid ${color}44`,
                        whiteSpace: 'nowrap', letterSpacing: 0.5,
                      }}>{p.type}</span>
                    </div>

                    {p.hasText && p.description && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, flex: 1, marginBottom: 16 }}>{p.description}</p>
                    )}

                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto', flexWrap: 'wrap' }}>
                      {p.hasLink && p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-cv" style={{ padding: '8px 16px', fontSize: 12, borderRadius: 10 }}>
                          <i className="mdi mdi-open-in-new" /> View Project
                        </a>
                      )}
                      {isDevMode && (
                        <>
                          <button onClick={() => openEdit(p)} style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 10, color: 'var(--accent-cyan)', cursor: 'pointer', padding: '8px 14px', fontSize: 13 }}>
                            <i className="mdi mdi-pencil" />
                          </button>
                          <button onClick={() => del(p.id)} style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: 10, color: '#ff6b6b', cursor: 'pointer', padding: '8px 14px', fontSize: 13 }}>
                            <i className="mdi mdi-delete" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <h3>✦ {editId === 'new' ? 'Add Project' : 'Edit Project'}</h3>

            <IconSearch value={form.icon} onChange={icon => setForm(f => ({ ...f, icon }))} />

            <label className="form-label">Project Name</label>
            <input className="form-input" placeholder="e.g. Smart Home Controller" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />

            <label className="form-label">Project Type</label>
            <select className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>

            {/* Content options */}
            <label className="form-label">Content</label>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              {[
                { key: 'hasText', label: '📝 Description' },
                { key: 'hasLink', label: '🔗 Link' },
                { key: 'hasImage', label: '🖼️ Image' },
              ].map(opt => (
                <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={form[opt.key]}
                    onChange={e => setForm(f => ({ ...f, [opt.key]: e.target.checked }))}
                    style={{ accentColor: 'var(--accent-cyan)', width: 16, height: 16 }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            {form.hasText && (
              <>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  placeholder="Describe your project..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </>
            )}

            {form.hasLink && (
              <>
                <label className="form-label">Project Link</label>
                <input className="form-input" placeholder="https://..." value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
              </>
            )}

            {form.hasImage && (
              <>
                <label className="form-label">Image Filename (from GitHub repo)</label>
                <input className="form-input" placeholder="e.g. project1.jpg or images/A.png" value={form.githubImageFile} onChange={e => setForm(f => ({ ...f, githubImageFile: e.target.value }))} />
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: -10, marginBottom: 14 }}>Upload image to your GitHub repo, then type the filename here</p>
              </>
            )}

            <button className="btn-save" onClick={save}><i className="mdi mdi-content-save" /> Save Project</button>
            <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
