import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Download, FileText, Image as ImageIcon, ArrowLeft, Check, Sparkles, X, ArrowRight, Award } from 'lucide-react';
import { renderCertificateToCanvas } from './utils/certificateRenderer';
import { downloadCertificatePDF, downloadCertificatePNG } from './utils/pdfGenerator';
import { DEFAULT_HACKATHON_PARTICIPANTS } from './utils/sampleData';
import GGULogo from './components/GGULogo';
import confetti from 'canvas-confetti';

export default function App() {
  const [participants] = useState(DEFAULT_HACKATHON_PARTICIPANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const canvasRef = useRef(null);
  const searchInputRef = useRef(null);

  // Default calibrated configuration for participation.png with BASE_URL support
  const config = {
    backgroundImage: `${import.meta.env.BASE_URL}templates/participation.png`,
    width: 1920,
    height: 1080,
    nameY: 46.4,
    nameX: 52.6,
    nameSize: 34,
    nameFont: 'Outfit',
    nameWeight: '700',
    nameColor: '#002b5b',
    collegeY: 53.4,
    collegeX: 50.8,
    collegeSize: 24,
    collegeFont: 'Outfit',
    collegeWeight: '600',
    collegeColor: '#002b5b',
    includeTeamInCollege: false
  };

  // Perform deduplicated search matching
  const matchingStudents = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const matches = participants.filter(p => 
      p.fullName.toLowerCase().includes(q)
    );

    const uniqueList = [];
    matches.forEach(candidate => {
      const isDuplicate = uniqueList.some(existing => {
        if (existing.teamSNo === candidate.teamSNo && existing.email && candidate.email && existing.email.toLowerCase() === candidate.email.toLowerCase()) {
          return true;
        }
        if (existing.teamSNo === candidate.teamSNo && existing.phone && candidate.phone && existing.phone.replace(/[^0-9]/g, '') === candidate.phone.replace(/[^0-9]/g, '')) {
          return true;
        }
        const c1 = existing.fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const c2 = candidate.fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (c1 === c2) return true;

        return false;
      });

      if (!isDuplicate) {
        uniqueList.push(candidate);
      }
    });

    return uniqueList;
  }, [participants, searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setHasSearched(true);
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSearch = () => {
    setSelectedStudent(null);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  // Render canvas whenever selectedStudent changes
  useEffect(() => {
    if (selectedStudent && canvasRef.current) {
      renderCertificateToCanvas(canvasRef.current, selectedStudent, config);
    }
  }, [selectedStudent]);

  const handleDownloadPDF = async () => {
    if (!selectedStudent) return;
    setDownloading(true);
    try {
      await downloadCertificatePDF(selectedStudent, config);
      confetti({ 
        particleCount: 80, 
        spread: 80, 
        origin: { y: 0.8 },
        colors: ['#4a2574', '#a82247', '#e11d27', '#ffffff']
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPNG = async () => {
    if (!selectedStudent) return;
    setDownloading(true);
    try {
      await downloadCertificatePNG(selectedStudent, config);
      confetti({ 
        particleCount: 80, 
        spread: 80, 
        origin: { y: 0.8 },
        colors: ['#4a2574', '#a82247', '#e11d27', '#ffffff']
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="portal-container">
      {/* Pure White App Bar with GGU Logo on Left Side */}
      <header className="portal-header">
        <div className="portal-header-content">
          {/* Left Side: GGU Official Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <GGULogo />
          </div>

          {/* Right Side: Responsive Event Title Badge */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <span className="header-badge-pill">
              <Award size={13} style={{ flexShrink: 0 }} />
              <span className="badge-full-text">MEDHA 2026 • 59th Engineers Day</span>
              <span className="badge-short-text">MEDHA 2026</span>
            </span>
          </div>
        </div>
      </header>

      <main className="portal-main">
        {/* VIEW 1: Search & Results Hub (When no student is selected) */}
        {!selectedStudent && (
          <div className="search-hero">
            <div className="hero-tag">
              <Sparkles size={14} />
              <span>GGU Certificate Verification</span>
            </div>

            <h2 className="hero-title">
              Download Your Participation Certificate
            </h2>

            <p className="hero-subtitle">
              Enter your registered full name below to find and download your official MEDHA 2026 Certificate of Participation.
            </p>

            {/* Center-Aligned Search Form */}
            <form onSubmit={handleSearchSubmit} className="search-form-card">
              <Search size={20} style={{ color: '#fb7185', marginLeft: '0.4rem', flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                type="text"
                className="search-input-field"
                placeholder="Enter full name (e.g. Pavan, Revathi)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!hasSearched) setHasSearched(true);
                }}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setHasSearched(false);
                    searchInputRef.current?.focus();
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                >
                  <X size={16} />
                </button>
              )}
              <button type="submit" className="btn btn-primary">
                <Search size={16} />
                <span>Search</span>
              </button>
            </form>

            {/* Search Outcomes List */}
            {hasSearched && searchQuery.trim().length > 0 && (
              <div className="results-container">
                <div className="results-header">
                  <span>
                    {matchingStudents.length === 0
                      ? 'No matching certificates found'
                      : `Found ${matchingStudents.length} matching certificate${matchingStudents.length > 1 ? 's' : ''}:`}
                  </span>
                  {matchingStudents.length > 0 && (
                    <span style={{ color: '#fb7185', fontWeight: 600 }}>Click to view certificate</span>
                  )}
                </div>

                {matchingStudents.length === 0 ? (
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem 1.25rem',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.4rem', fontWeight: 700 }}>
                      No record found for "{searchQuery}"
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Please ensure your name matches the registration record in the Hackathon / Project Expo sheet.
                    </p>
                  </div>
                ) : (
                  matchingStudents.map((student) => (
                    <div
                      key={student.id}
                      className="result-card"
                      onClick={() => handleSelectStudent(student)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textAlign: 'left', minWidth: 0, flex: 1 }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(74, 37, 116, 0.3), rgba(225, 29, 39, 0.3))',
                          border: '1px solid rgba(225, 29, 39, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fb7185',
                          flexShrink: 0
                        }}>
                          <User size={20} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <span>{student.fullName}</span>
                            <span className={`role-badge ${student.role === 'Team Lead' ? 'lead' : 'member'}`}>
                              {student.role}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            🎓 {student.collegeName} • ⚡ {student.teamName}
                          </div>
                        </div>
                      </div>

                      <button className="btn btn-primary" style={{ padding: '0.5rem 0.95rem', fontSize: '0.82rem' }}>
                        <span>View Certificate</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Individual Certificate Preview & Download Page */}
        {selectedStudent && (
          <div className="cert-view-container">
            {/* Top Toolbar */}
            <div className="cert-top-bar">
              <button className="btn btn-secondary" onClick={handleBackToSearch} style={{ width: 'fit-content' }}>
                <ArrowLeft size={16} />
                <span>Search Another</span>
              </button>

              <div style={{ textAlign: 'center', minWidth: 0, flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                  {selectedStudent.fullName}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedStudent.collegeName} • Team: {selectedStudent.teamName}
                </p>
              </div>

              <div className="cert-actions-row" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={handleDownloadPNG}
                  disabled={downloading}
                  title="Save high-resolution PNG image"
                  style={{ flex: 1 }}
                >
                  <ImageIcon size={15} />
                  <span>Image</span>
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  title="Download print-ready PDF"
                  style={{ flex: 1 }}
                >
                  {downloadSuccess ? <Check size={16} /> : <Download size={16} />}
                  <span>{downloadSuccess ? 'Downloaded!' : 'PDF'}</span>
                </button>
              </div>
            </div>

            {/* Certificate Canvas Card */}
            <div className="cert-canvas-card">
              <canvas ref={canvasRef} className="portal-canvas" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-subtle)', fontSize: '0.78rem', flexWrap: 'wrap', textAlign: 'center' }}>
              <span>Official GGU MEDHA Certificate ID:</span>
              <code style={{ background: 'rgba(225, 29, 39, 0.15)', border: '1px solid rgba(225, 29, 39, 0.3)', padding: '0.15rem 0.45rem', borderRadius: 4, color: '#fda4af', fontWeight: 600 }}>
                {selectedStudent.certId}
              </code>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
