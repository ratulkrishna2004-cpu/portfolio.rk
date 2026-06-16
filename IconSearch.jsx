import React, { useState, useMemo } from 'react';

// Common MDI icons list
const ICON_LIST = [
  'mdi-lightning-bolt','mdi-chip','mdi-cpu-64-bit','mdi-robot','mdi-circuit-board',
  'mdi-resistor','mdi-sine-wave','mdi-transmission-tower','mdi-flash','mdi-battery-charging',
  'mdi-code-braces','mdi-language-cpp','mdi-language-c','mdi-console','mdi-terminal',
  'mdi-microsoft-excel','mdi-microsoft-word','mdi-microsoft-powerpoint','mdi-google-drive',
  'mdi-candle','mdi-palette','mdi-brush','mdi-pencil','mdi-vector-curve',
  'mdi-school','mdi-book-open-variant','mdi-diploma','mdi-graduation-cap','mdi-certificate',
  'mdi-trophy','mdi-medal','mdi-star','mdi-star-circle','mdi-podium-gold','mdi-podium',
  'mdi-music','mdi-microphone','mdi-music-note','mdi-headphones',
  'mdi-bow-arrow','mdi-target','mdi-bullseye-arrow',
  'mdi-account-group','mdi-account','mdi-account-star','mdi-handshake',
  'mdi-briefcase','mdi-domain','mdi-office-building','mdi-city',
  'mdi-phone','mdi-whatsapp','mdi-gmail','mdi-linkedin','mdi-facebook',
  'mdi-map-marker','mdi-earth','mdi-map',
  'mdi-git','mdi-github','mdi-gitlab',
  'mdi-web','mdi-link','mdi-open-in-new',
  'mdi-email','mdi-email-outline','mdi-message',
  'mdi-telescope','mdi-atom','mdi-flask','mdi-microscope','mdi-dna',
  'mdi-rocket','mdi-satellite','mdi-space-station',
  'mdi-math-integral','mdi-function','mdi-calculator',
  'mdi-leaf','mdi-tree','mdi-earth',
  'mdi-wrench','mdi-tools','mdi-cog','mdi-hammer',
  'mdi-chart-line','mdi-chart-bar','mdi-poll','mdi-database',
  'mdi-shield-check','mdi-lock','mdi-key',
  'mdi-heart','mdi-thumb-up','mdi-fire','mdi-lightning-bolt-circle',
  'mdi-lan','mdi-network','mdi-wifi','mdi-bluetooth',
  'mdi-monitor','mdi-laptop','mdi-cellphone','mdi-tablet',
  'mdi-folder','mdi-file-document','mdi-file-code',
  'mdi-download','mdi-upload','mdi-cloud',
  'mdi-play-circle','mdi-youtube','mdi-instagram','mdi-twitter',
  'mdi-pen','mdi-fountain-pen','mdi-typewriter',
  'mdi-home','mdi-information','mdi-help-circle',
  'mdi-check-circle','mdi-close-circle','mdi-alert-circle',
  'mdi-plus-circle','mdi-minus-circle','mdi-arrow-right-circle',
  'mdi-flag','mdi-bell','mdi-bookmark','mdi-tag',
  'mdi-eye','mdi-magnify','mdi-filter',
  'mdi-camera','mdi-image','mdi-video',
  'mdi-printer','mdi-scanner','mdi-fax',
  'mdi-currency-usd','mdi-bank','mdi-credit-card',
  'mdi-car','mdi-airplane','mdi-train','mdi-bicycle',
  'mdi-food','mdi-coffee','mdi-glass-wine',
  'mdi-dumbbell','mdi-run','mdi-swim','mdi-soccer',
  'mdi-puzzle','mdi-gamepad','mdi-chess-king',
];

export default function IconSearch({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return ICON_LIST.slice(0, 60);
    return ICON_LIST.filter(i => i.includes(query.toLowerCase())).slice(0, 60);
  }, [query]);

  return (
    <div style={{ marginBottom: 14 }}>
      <label className="form-label">Icon</label>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'rgba(0,212,255,0.1)',
            border: '1px solid rgba(0,212,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, color: 'var(--accent-cyan)', flexShrink: 0,
            cursor: 'pointer'
          }}
          onClick={() => setOpen(!open)}
        >
          <i className={`mdi ${value || 'mdi-star'}`} />
        </div>
        <input
          className="form-input"
          style={{ margin: 0, flex: 1 }}
          placeholder="Search icon (e.g. robot, star, music)..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && (
        <div className="icon-grid">
          {filtered.map(icon => (
            <div
              key={icon}
              className={`icon-option${value === icon ? ' selected' : ''}`}
              onClick={() => { onChange(icon); setOpen(false); }}
              title={icon.replace('mdi-', '')}
            >
              <i className={`mdi ${icon}`} />
              <span>{icon.replace('mdi-', '').slice(0,8)}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>
              No icons found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
