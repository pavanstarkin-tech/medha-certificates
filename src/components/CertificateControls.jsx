import React, { useRef } from 'react';
import { UploadCloud, Sliders, RotateCcw, Check } from 'lucide-react';

export default function CertificateControls({ config, onChangeConfig }) {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChangeConfig({
          ...config,
          backgroundImage: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPositions = () => {
    onChangeConfig({
      ...config,
      nameY: 46.4,
      nameX: 52.6,
      nameSize: 34,
      collegeY: 53.4,
      collegeX: 50.8,
      collegeSize: 24,
      includeTeamInCollege: false
    });
  };

  return (
    <aside className="sidebar-panel">
      {/* 1. Official Template Info & Replacement */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label className="control-label" style={{ color: 'var(--accent-gold)', marginBottom: 0 }}>
            MEDHA Participation Template
          </label>
          <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Check size={13} /> Active
          </span>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*" 
          onChange={handleImageUpload} 
        />

        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed rgba(245, 158, 11, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: 'rgba(0, 0, 0, 0.25)',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)'
          }}>
            <UploadCloud size={20} />
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
              Replace Certificate Image
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Using participation.png background
            </div>
          </div>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border-color)', margin: '0.25rem 0' }} />

      {/* 2. Precision Alignment Sliders */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sliders size={15} color="#f59e0b" />
          <span>Placement Alignment</span>
        </h4>
        <button 
          className="btn btn-secondary" 
          style={{ padding: '0.2rem 0.45rem', fontSize: '0.72rem' }}
          onClick={handleResetPositions}
          title="Reset sliders to exact template lines"
        >
          <RotateCcw size={12} />
          <span>Reset Alignment</span>
        </button>
      </div>

      {/* 1. Student Full Name */}
      <div className="control-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="control-label" style={{ color: 'var(--accent-gold)' }}>1. Student Full Name (Line 1)</label>
          <input 
            type="color" 
            value={config.nameColor || '#002b5b'} 
            onChange={(e) => onChangeConfig({ ...config, nameColor: e.target.value })}
            style={{ width: 20, height: 20, border: 'none', background: 'transparent', cursor: 'pointer' }}
            title="Name Color"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div className="slider-container">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Y:</span>
            <input 
              type="range" 
              min="30" 
              max="65" 
              step="0.2"
              value={config.nameY ?? 46.4} 
              onChange={(e) => onChangeConfig({ ...config, nameY: parseFloat(e.target.value) })}
              className="slider-input" 
            />
            <span className="slider-val">{config.nameY ?? 46.4}%</span>
          </div>

          <div className="slider-container">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>X:</span>
            <input 
              type="range" 
              min="30" 
              max="70" 
              step="0.2"
              value={config.nameX ?? 52.6} 
              onChange={(e) => onChangeConfig({ ...config, nameX: parseFloat(e.target.value) })}
              className="slider-input" 
            />
            <span className="slider-val">{config.nameX ?? 52.6}%</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div className="slider-container">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Size:</span>
            <input 
              type="range" 
              min="20" 
              max="50" 
              value={config.nameSize ?? 34} 
              onChange={(e) => onChangeConfig({ ...config, nameSize: parseInt(e.target.value) })}
              className="slider-input" 
            />
            <span className="slider-val">{config.nameSize ?? 34}px</span>
          </div>

          <select 
            className="select-input" 
            value={config.nameFont || 'Outfit'} 
            onChange={(e) => onChangeConfig({ ...config, nameFont: e.target.value })}
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.5rem' }}
          >
            <option value="Outfit">Outfit (Clean Bold)</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Playfair Display">Playfair (Serif)</option>
            <option value="Cinzel">Cinzel (Formal)</option>
            <option value="Alex Brush">Alex Brush (Script)</option>
          </select>
        </div>
      </div>

      {/* 2. College / Department */}
      <div className="control-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="control-label" style={{ color: '#60a5fa' }}>2. College / Department (Line 2)</label>
          <input 
            type="color" 
            value={config.collegeColor || '#002b5b'} 
            onChange={(e) => onChangeConfig({ ...config, collegeColor: e.target.value })}
            style={{ width: 20, height: 20, border: 'none', background: 'transparent', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div className="slider-container">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Y:</span>
            <input 
              type="range" 
              min="40" 
              max="70" 
              step="0.2"
              value={config.collegeY ?? 53.4} 
              onChange={(e) => onChangeConfig({ ...config, collegeY: parseFloat(e.target.value) })}
              className="slider-input" 
            />
            <span className="slider-val">{config.collegeY ?? 53.4}%</span>
          </div>

          <div className="slider-container">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>X:</span>
            <input 
              type="range" 
              min="30" 
              max="70" 
              step="0.2"
              value={config.collegeX ?? 50.8} 
              onChange={(e) => onChangeConfig({ ...config, collegeX: parseFloat(e.target.value) })}
              className="slider-input" 
            />
            <span className="slider-val">{config.collegeX ?? 50.8}%</span>
          </div>
        </div>

        <div className="slider-container">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Size:</span>
          <input 
            type="range" 
            min="16" 
            max="38" 
            value={config.collegeSize ?? 24} 
            onChange={(e) => onChangeConfig({ ...config, collegeSize: parseInt(e.target.value) })}
            className="slider-input" 
          />
          <span className="slider-val">{config.collegeSize ?? 24}px</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem', background: 'rgba(0,0,0,0.25)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Include Team Name in line:</span>
          <input 
            type="checkbox" 
            checked={!!config.includeTeamInCollege} 
            onChange={(e) => onChangeConfig({ ...config, includeTeamInCollege: e.target.checked })}
            style={{ accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
          />
        </div>
      </div>
    </aside>
  );
}
