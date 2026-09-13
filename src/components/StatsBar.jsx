import React from 'react';
import { Users, Shield, School, Award } from 'lucide-react';

export default function StatsBar({ participants, currentParticipant }) {
  const totalParticipants = participants.length;
  const uniqueTeams = new Set(participants.map(p => p.teamName)).size;
  const uniqueColleges = new Set(participants.map(p => p.collegeName)).size;
  const teamLeads = participants.filter(p => p.role === 'Team Lead').length;
  const teamMembers = participants.filter(p => p.role === 'Team Member').length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon gold">
          <Award size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{totalParticipants}</span>
          <span className="stat-label">Total Certificates</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon blue">
          <Users size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{uniqueTeams}</span>
          <span className="stat-label">Registered Teams ({teamLeads} Leads + {teamMembers} Members)</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon cyan">
          <School size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{uniqueColleges}</span>
          <span className="stat-label">Participating Colleges</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon purple">
          <Shield size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value" style={{ fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
            {currentParticipant ? currentParticipant.fullName : 'None'}
          </span>
          <span className="stat-label">Current Preview Participant</span>
        </div>
      </div>
    </div>
  );
}
