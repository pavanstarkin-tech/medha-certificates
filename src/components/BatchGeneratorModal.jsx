import React, { useState } from 'react';
import { Download, FileArchive, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { generateBatchZIP } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';

export default function BatchGeneratorModal({
  isOpen,
  onClose,
  participants,
  config
}) {
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0, currentName: '', status: '' });
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const handleStartBatch = async () => {
    setIsGenerating(true);
    setCompleted(false);

    try {
      await generateBatchZIP(participants, config, format, (p) => {
        setProgress(p);
      });
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      setCompleted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileArchive size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Batch Certificate Exporter</h3>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }} onClick={onClose} disabled={isGenerating}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Export personalized certificates for all <strong>{participants.length}</strong> participants into a single compressed ZIP archive.
          </p>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Certificates:</span>
              <span style={{ fontWeight: 600 }}>{participants.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Selected Template:</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>
                {config.customBgImage ? 'Custom Background Image' : config.templateId}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Event Title:</span>
              <span style={{ fontWeight: 600 }}>{config.eventName || 'AI Hackathon 2026'}</span>
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">Export Format</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                className={`btn ${format === 'pdf' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFormat('pdf')}
                disabled={isGenerating}
                style={{ justifyContent: 'center' }}
              >
                <span>Print-Ready PDFs (.pdf)</span>
              </button>
              <button
                className={`btn ${format === 'png' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFormat('png')}
                disabled={isGenerating}
                style={{ justifyContent: 'center' }}
              >
                <span>High-Res PNGs (.png)</span>
              </button>
            </div>
          </div>

          {isGenerating && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  {progress.status || `Rendering: ${progress.currentName || 'Processing'}...`}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>
                  {progress.current} / {progress.total} ({progress.percent}%)
                </span>
              </div>
              <div className="progress-container">
                <div className="progress-bar-fill" style={{ width: `${progress.percent}%` }} />
              </div>
            </div>
          )}

          {completed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#34d399' }}>
              <CheckCircle2 size={24} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Batch Generation Complete!</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>Your ZIP file has been downloaded with all {participants.length} certificates.</div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={isGenerating}>
            {completed ? 'Close' : 'Cancel'}
          </button>
          {!completed && (
            <button 
              className="btn btn-primary" 
              onClick={handleStartBatch}
              disabled={isGenerating || participants.length === 0}
            >
              <Download size={16} />
              <span>{isGenerating ? 'Generating...' : `Generate & Download ZIP (${participants.length})`}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
