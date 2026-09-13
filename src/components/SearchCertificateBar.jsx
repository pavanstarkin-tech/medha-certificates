import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, User, School, Download, Eye, FileText, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { downloadCertificatePDF, downloadCertificatePNG } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';

export default function SearchCertificateBar({ 
  participants, 
  onSelectParticipant, 
  currentParticipant,
  config 
}) {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Filter matches
  const searchResults = useMemo(() => {
    const term = (submittedQuery || query).trim().toLowerCase();
    if (!term) return [];
    return participants.filter(p => 
      p.fullName.toLowerCase().includes(term) ||
      p.collegeName.toLowerCase().includes(term) ||
      p.teamName.toLowerCase().includes(term) ||
      p.certId.toLowerCase().includes(term)
    );
  }, [participants, query, submittedQuery]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setSubmittedQuery(query.trim());
    setIsDropdownOpen(true);

    // If there's a match, select the first match automatically
    const matches = participants.filter(p => 
      p.fullName.toLowerCase().includes(query.trim().toLowerCase())
    );
    if (matches.length > 0) {
      onSelectParticipant(matches[0]);
    }
  };

  const handleSelect = (p) => {
    onSelectParticipant(p);
    setIsDropdownOpen(false);
    // Smooth scroll to certificate preview
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleClear = () => {
    setQuery('');
    setSubmittedQuery('');
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const handleQuickDownloadPDF = async (p, e) => {
    e.stopPropagation();
    try {
      await downloadCertificatePDF(p, config);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="search-hub-container" ref={containerRef} style={{ maxWidth: 1600, margin: '1.25rem auto 0', padding: '0 2rem', width: '100%' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(18, 24, 38, 0.95), rgba(30, 41, 59, 0.95))',
        border: '1.5px solid rgba(245, 158, 11, 0.35)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.5), 0 0 20px rgba(245, 158, 11, 0.1)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={18} color="#f59e0b" />
              <span>Find & Download Student Certificate</span>
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Type any student name, college, or team to instantly preview and download their official MEDHA certificate
            </p>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.6rem', borderRadius: 9999 }}>
            Total Database: <strong style={{ color: 'var(--accent-gold)' }}>{participants.length}</strong> Registered Participants
          </div>
        </div>

        {/* Search Bar Form with Search Button */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.6rem', width: '100%' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              ref={inputRef}
              type="text"
              className="input-text"
              placeholder="Enter student name (e.g. Pavan, Revathi, Srinadh, Jyothi, Charan)..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSubmittedQuery('');
                setIsDropdownOpen(true);
              }}
              onFocus={() => {
                if (query.trim()) setIsDropdownOpen(true);
              }}
              style={{
                paddingLeft: '2.75rem',
                paddingRight: query ? '2.5rem' : '1rem',
                height: '48px',
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                background: '#090d16'
              }}
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: '0 1.5rem',
              height: '48px',
              fontSize: '0.95rem',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Search size={18} />
            <span>Search Certificate</span>
          </button>
        </form>

        {/* Live Search Results Dropdown / Panel */}
        {isDropdownOpen && query.trim().length > 0 && (
          <div style={{
            position: 'absolute',
            left: '1.5rem',
            right: '1.5rem',
            top: 'calc(100% + 8px)',
            background: '#0f172a',
            border: '1.5px solid rgba(245, 158, 11, 0.4)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            zIndex: 100,
            maxHeight: '360px',
            overflowY: 'auto',
            padding: '0.5rem'
          }}>
            {searchResults.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No participants found matching "<strong>{query}</strong>". Try checking the spelling.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Found {searchResults.length} Matching Certificate{searchResults.length > 1 ? 's' : ''} (Click to Preview & Download)
                </div>

                {searchResults.map((p) => {
                  const isCurrent = currentParticipant?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(p)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: isCurrent ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isCurrent ? 'var(--accent-gold)' : 'transparent'}`,
                        cursor: 'pointer',
                        transition: 'background 0.15s, transform 0.15s',
                        gap: '1rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = isCurrent ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: 'rgba(245, 158, 11, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fbbf24',
                          flexShrink: 0
                        }}>
                          <User size={18} />
                        </div>

                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span>{p.fullName}</span>
                            <span className={`role-badge ${p.role === 'Team Lead' ? 'lead' : 'member'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                              {p.role}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            🎓 {p.collegeName} • ⚡ Team: {p.teamName}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(p);
                          }}
                        >
                          <Eye size={13} />
                          <span>Preview</span>
                        </button>

                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={(e) => handleQuickDownloadPDF(p, e)}
                          title="Download PDF"
                        >
                          <FileText size={13} />
                          <span>Download PDF</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
