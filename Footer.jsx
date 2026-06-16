import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import IconSearch from './IconSearch';

const DEFAULT_CONTACTS = [
  { id: '1', icon: 'mdi-phone', label: 'Phone', value: '+8801623519646', type: 'phone' },
  { id: '2', icon: 'mdi-whatsapp', label: 'WhatsApp', value: '+8801623519646', type: 'whatsapp' },
  { id: '3', icon: 'mdi-email', label: 'Email', value: 'ratulkrishna2004@gmail.com', type: 'email' },
  { id: '4', icon: 'mdi-linkedin', label: 'LinkedIn', value: 'https://www.linkedin.com/in/ratul-krishna-b09i24/', type: 'link' },
  { id: '5', icon: 'mdi-facebook', label: 'Facebook', value: '', type: 'link' },
  { id: '6', icon: 'mdi-map-marker', label: 'Location', value: 'Bangladesh', type: 'location' },
];

export default function Footer() {
  const { isDevMode } = useAuth();
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ icon: 'mdi-phone', label: '', value: '', type: 'link' });
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'portfolio', 'contacts'), snap => {
      if (snap.exists()) setContacts(snap.data().list || DEFAULT_CONTACTS);
    });
    return unsub;
  }, []);

  const save = async () => {
    let list;
    if (editItem === 'new') {
      list = [...contacts, { ...form, id: Date.now().toString() }];
    } else {
      list = contacts.map(c => c.id === editItem ? { ...c, ...form } : c);
    }
    await setDoc(doc(db, 'portfolio', 'contacts'), { list });
    setShowModal(false);
  };

  const del = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    const list = contacts.filter(c => c.id !== id);
    await setDoc(doc(db, 'portfolio', 'contacts'), { list });
  };

  const openAdd = () => {
    setForm({ icon: 'mdi-phone', label: '', value: '', type: 'link' });
    setEditItem('new');
    setShowModal(true);
  };

  const openEdit = (c) => {
    setForm({ icon: c.icon, label: c.label, value: c.value, type: c.type });
    setEditItem(c.id);
    setShowModal(true);
  };

  const handleClick = (c) => {
    if (c.type === 'phone') {
      navigator.clipboard.writeText(c.value);
      setCopied(c.id);
      setTimeout(() => setCopied(''), 2000);
    } else if (c.type === 'whatsapp') {
      window.open(`https://wa.me/${c.value.replace(/\D/g, '')}`, '_blank');
    } else if (c.type === 'email') {
      window.open(`mailto:${c.value}`, '_blank');
    } else if (c.type === 'link' && c.value) {
      window.open(c.value, '_blank');
    } else if (c.type === 'location') {
      window.open(`https://maps.google.com/?q=${c.value}`, '_blank');
    }
  };

  return (
    <footer style={{
      position: 'relative', zIndex: 1,
      background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
      borderTop: '1px solid var(--border)',
      padding: '60px 40px 30px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>
          <span style={{ background: 'linear-gradient(135deg, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Let's Connect
          </span>
          {' '}✨
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>Reach out for opportunities, collaborations, or just to say hi!</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 14,
          marginBottom: 40,
        }}>
          {contacts.map(c => (
            <div
              key={c.id}
              className="glass-card"
              style={{
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onClick={() => !isDevMode && handleClick(c)}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(0,212,255,0.2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: 'var(--accent-cyan)',
                border: '1px solid rgba(0,212,255,0.2)',
              }}>
                <i className={`mdi ${c.icon}`} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{c.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {copied === c.id ? '✓ Copied!' : (c.type === 'location' ? c.value : c.value ? (c.value.startsWith('http') ? 'Open link' : c.value) : 'Not set')}
                </div>
              </div>
              {isDevMode && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={e => { e.stopPropagation(); openEdit(c); }} style={{ background: 'rgba(0,212,255,0.1)', border: 'none', borderRadius: 8, color: 'var(--accent-cyan)', cursor: 'pointer', padding: '6px 8px', fontSize: 14 }}>
                    <i className="mdi mdi-pencil" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); del(c.id); }} style={{ background: 'rgba(255,80,80,0.1)', border: 'none', borderRadius: 8, color: '#ff6b6b', cursor: 'pointer', padding: '6px 8px', fontSize: 14 }}>
                    <i className="mdi mdi-delete" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {isDevMode && (
            <button className="btn-add" onClick={openAdd} style={{ minHeight: 80, justifyContent: 'center' }}>
              <i className="mdi mdi-plus-circle" />
              Add Contact
            </button>
          )}
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
          © 2025 Ratul Krishna Mojumder
          <span style={{ margin: '0 12px', color: 'var(--border)' }}>|</span>
          Built with ⚡ & 💜
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>✦ {editItem === 'new' ? 'Add Contact' : 'Edit Contact'}</h3>
            <IconSearch value={form.icon} onChange={icon => setForm(f => ({ ...f, icon }))} />
            <label className="form-label">Label</label>
            <input className="form-input" placeholder="e.g. Phone, Email" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
            <label className="form-label">Type</label>
            <select className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="phone">Phone (click to copy)</option>
              <option value="email">Email (opens mail)</option>
              <option value="whatsapp">WhatsApp (opens chat)</option>
              <option value="link">Link (opens URL)</option>
              <option value="location">Location (opens maps)</option>
            </select>
            <label className="form-label">Value (number / email / URL)</label>
            <input className="form-input" placeholder="Value..." value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
            <button className="btn-save" onClick={save}><i className="mdi mdi-content-save" /> Save</button>
            <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </footer>
  );
}
