import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Image as ImageIcon, FileText, Maximize2, ZoomIn, ZoomOut, Check } from 'lucide-react';
import { renderCertificateToCanvas } from '../utils/certificateRenderer';
import { downloadCertificatePDF, downloadCertificatePNG } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';

export default function CertificateCanvas({
  participant,
  currentIndex,
  totalParticipants,
  onPrevParticipant,
  onNextParticipant,
  config
}) {
  const canvasRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (canvasRef.current && participant) {
      renderCertificateToCanvas(canvasRef.current, participant, config);
    }
  }, [participant, config]);

  const handleDownloadPDF = async () => {
    if (!participant) return;
    setDownloading(true);
    try {
      await downloadCertificatePDF(participant, config);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPNG = async () => {
    if (!participant) return;
    setDownloading(true);
    try {
      await downloadCertificatePNG(participant, config);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  if (!participant) {
    return (
      <div className="canvas-container-card" style={{ minHeight: 400, justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No participant selected to preview.</p>
      </div>
    );
  }

  return (
    <div className="canvas-container-card">
      {/* Top Toolbar */}
      <div className="canvas-header">
        <div className="switcher-bar">
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.3rem 0.6rem' }} 
            onClick={onPrevParticipant}
            disabled={currentIndex <= 0}
            title="Previous Participant (Left Arrow)"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="switcher-info">
            <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>#{currentIndex + 1}</span>
            <span style={{ color: 'var(--text-muted)' }}> of {totalParticipants}</span>
            <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>|</span>
            <span style={{ fontWeight: 600 }}>{participant.fullName}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}> ({participant.role})</span>
          </div>

          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.3rem 0.6rem' }} 
            onClick={onNextParticipant}
            disabled={currentIndex >= totalParticipants - 1}
            title="Next Participant (Right Arrow)"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', padding: 2 }}>
            <button 
              className="btn btn-secondary" 
              style={{ border: 'none', padding: '0.35rem 0.6rem' }} 
              onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.15))}
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {Math.round(zoomLevel * 100)}%
            </span>
            <button 
              className="btn btn-secondary" 
              style={{ border: 'none', padding: '0.35rem 0.6rem' }} 
              onClick={() => setZoomLevel(prev => Math.min(1.6, prev + 0.15))}
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={handleDownloadPNG}
            disabled={downloading}
            title="Download high-resolution PNG image"
          >
            <ImageIcon size={15} />
            <span>Save PNG</span>
          </button>

          <button 
            className="btn btn-primary" 
            onClick={handleDownloadPDF}
            disabled={downloading}
            title="Download print-ready vector PDF"
          >
            {downloadSuccess ? <Check size={16} /> : <FileText size={16} />}
            <span>{downloadSuccess ? 'Downloaded!' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="canvas-wrapper">
        <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center top', transition: 'transform 0.15s ease' }}>
          <canvas ref={canvasRef} className="cert-canvas" />
        </div>
      </div>

      <div style={{ marginTop: '0.85rem', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
        <span>🎓 Institution: <strong style={{ color: 'var(--text-muted)' }}>{participant.collegeName}</strong></span>
        <span>⚡ Team: <strong style={{ color: 'var(--text-muted)' }}>{participant.teamName}</strong></span>
        <span>🏷️ ID: <strong style={{ color: 'var(--text-muted)' }}>{participant.certId}</strong></span>
      </div>
    </div>
  );
}
