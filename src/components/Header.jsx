import React from 'react';
import { Award, Download, UploadCloud, RefreshCw } from 'lucide-react';

export default function Header({ 
  onUploadClick, 
  onBatchClick, 
  onReloadDefault, 
  participantCount
}) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="brand-section">
          <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #b91c1c, #d97706)' }}>
            <Award size={24} />
          </div>
          <div>
            <h1 className="brand-title">MEDHA 2026 Certificate Studio</h1>
            <p className="brand-subtitle">GGU 59th Engineers Day • Automated Certificate Generator</p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="btn btn-secondary" 
            onClick={onReloadDefault}
            title="Reload Hackathon Excel Dataset"
          >
            <RefreshCw size={15} />
            <span>Reset Excel Data</span>
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={onUploadClick}
          >
            <UploadCloud size={16} />
            <span>Import New Excel</span>
          </button>

          <button 
            className="btn btn-primary"
            onClick={onBatchClick}
            disabled={participantCount === 0}
          >
            <Download size={16} />
            <span>Batch Export All ({participantCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
