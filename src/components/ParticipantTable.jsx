import React, { useState, useMemo } from 'react';
import { Search, Download, Eye, CheckSquare, Square, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { downloadCertificatePDF } from '../utils/pdfGenerator';

export default function ParticipantTable({
  participants,
  currentParticipant,
  onSelectParticipant,
  config,
  onBatchExportSelected
}) {
  const [inputVal, setInputVal] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [collegeFilter, setCollegeFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Extract unique colleges
  const uniqueColleges = useMemo(() => {
    const list = Array.from(new Set(participants.map(p => p.collegeName))).filter(Boolean);
    return list.sort();
  }, [participants]);

  const handleTriggerSearch = (e) => {
    if (e) e.preventDefault();
    setSearchTerm(inputVal.trim());
    setCurrentPage(1);
  };

  // Filtered dataset
  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      const matchSearch = searchTerm === '' || 
        (p.fullName && p.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.teamName && p.teamName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.collegeName && p.collegeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.certId && p.certId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchRole = roleFilter === 'ALL' || p.role === roleFilter;
      const matchCollege = collegeFilter === 'ALL' || p.collegeName === collegeFilter;

      return matchSearch && matchRole && matchCollege;
    });
  }, [participants, searchTerm, roleFilter, collegeFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredParticipants.length / pageSize));
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredParticipants.slice(start, start + pageSize);
  }, [filteredParticipants, currentPage, pageSize]);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredParticipants.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredParticipants.map(p => p.id)));
    }
  };

  const toggleSelectOne = (id, e) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  return (
    <div className="table-card">
      <div className="table-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            All Registered Participants
          </h3>
          <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.08)', padding: '0.2rem 0.6rem', borderRadius: 9999, color: 'var(--text-muted)' }}>
            Showing {filteredParticipants.length} of {participants.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {selectedIds.size > 0 && (
            <button 
              className="btn btn-primary"
              onClick={() => {
                const selectedItems = participants.filter(p => selectedIds.has(p.id));
                onBatchExportSelected(selectedItems);
              }}
            >
              <Download size={15} />
              <span>Export Selected ({selectedIds.size})</span>
            </button>
          )}

          {/* Search Form with Input and Search Button */}
          <form onSubmit={handleTriggerSearch} style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <div className="search-box">
              <Search size={15} className="search-icon" />
              <input 
                type="text" 
                className="input-text" 
                placeholder="Search name, team..." 
                value={inputVal} 
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (e.target.value === '') {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }
                }}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-secondary" 
              style={{ padding: '0.55rem 0.85rem' }}
              title="Search directory"
            >
              <Search size={14} />
              <span>Search</span>
            </button>
          </form>

          {/* Role Filter */}
          <select 
            className="select-input" 
            style={{ width: 'auto', minWidth: 120 }}
            value={roleFilter} 
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Roles</option>
            <option value="Team Lead">Team Leads</option>
            <option value="Team Member">Team Members</option>
          </select>

          {/* College Filter */}
          <select 
            className="select-input" 
            style={{ width: 'auto', maxWidth: 200 }}
            value={collegeFilter} 
            onChange={(e) => {
              setCollegeFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Colleges ({uniqueColleges.length})</option>
            {uniqueColleges.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40, textAlign: 'center' }}>
                <button 
                  onClick={handleSelectAll} 
                  style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {selectedIds.size === filteredParticipants.length && filteredParticipants.length > 0 ? (
                    <CheckSquare size={16} color="#fbbf24" />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
              </th>
              <th>Student Full Name</th>
              <th>College / University</th>
              <th>Team Name</th>
              <th>Role</th>
              <th>Certificate ID</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No participants match your search "{searchTerm}".
                </td>
              </tr>
            ) : (
              paginatedList.map((p) => {
                const isSelected = selectedIds.has(p.id);
                const isCurrent = currentParticipant?.id === p.id;
                return (
                  <tr 
                    key={p.id} 
                    className={isCurrent ? 'selected-row' : ''}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectParticipant(p)}
                  >
                    <td style={{ textAlign: 'center' }} onClick={(e) => toggleSelectOne(p.id, e)}>
                      {isSelected ? (
                        <CheckSquare size={16} color="#fbbf24" />
                      ) : (
                        <Square size={16} color="#64748b" />
                      )}
                    </td>
                    <td style={{ fontWeight: 600, color: isCurrent ? 'var(--accent-gold)' : 'var(--text-main)' }}>
                      {p.fullName}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {p.collegeName}
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{p.teamName}</span>
                    </td>
                    <td>
                      <span className={`role-badge ${p.role === 'Team Lead' ? 'lead' : 'member'}`}>
                        {p.role}
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.15rem 0.45rem', borderRadius: 4, color: 'var(--text-muted)' }}>
                        {p.certId}
                      </code>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }}
                          title="Preview in Canvas Studio"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectParticipant(p);
                          }}
                        >
                          <Eye size={13} />
                          <span>Preview</span>
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }}
                          title="Instant Download PDF"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadCertificatePDF(p, config);
                          }}
                        >
                          <FileText size={13} color="#f59e0b" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Page {currentPage} of {totalPages} ({filteredParticipants.length} total participants)
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.35rem 0.65rem' }}
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft size={15} />
            <span>Prev</span>
          </button>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.35rem 0.65rem' }}
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            <span>Next</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
