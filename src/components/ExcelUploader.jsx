import React, { useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { parseExcelWorkbook } from '../utils/excelParser';

export default function ExcelUploader({ isOpen, onClose, onDataLoaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFile = async (file) => {
    if (!file) return;
    setError(null);
    setSuccessMsg('');
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const extractedParticipants = parseExcelWorkbook(buffer);

      if (!extractedParticipants || extractedParticipants.length === 0) {
        throw new Error('No valid participant records found in this file. Please check column headers.');
      }

      setSuccessMsg(`Successfully parsed ${extractedParticipants.length} participants from "${file.name}"!`);
      setTimeout(() => {
        onDataLoaded(extractedParticipants);
        setLoading(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to parse Excel file. Please verify file format.');
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileSpreadsheet size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Import Excel / CSV Registration Sheet</h3>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Upload your Hackathon registration Excel spreadsheet (<code>.xlsx</code>, <code>.xls</code>, or <code>.csv</code>). 
            Our intelligent parser automatically extracts team leads, every individual member, colleges, and team details.
          </p>

          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.15)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragging ? 'rgba(245, 158, 11, 0.05)' : 'rgba(0, 0, 0, 0.25)',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.85rem'
            }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".xlsx, .xls, .csv" 
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)'
            }}>
              <UploadCloud size={28} />
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                Click to browse or drag & drop your Excel file here
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Supports .xlsx, .xls, .csv with multi-member team columns or standard tabular records
              </div>
            </div>
          </div>

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', color: 'var(--accent-gold)', fontSize: '0.9rem' }}>
              <div className="animate-spin">⏳</div>
              <span>Processing participants & extracting team members...</span>
            </div>
          )}

          {successMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#34d399', fontSize: '0.85rem' }}>
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.85rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
