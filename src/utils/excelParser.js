import * as XLSX from 'xlsx';

function cleanStr(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizePhone(p) {
  return String(p || '').replace(/[^0-9]/g, '').slice(-10);
}

function areParticipantsDuplicate(p1, p2) {
  if (p1.teamSNo && p2.teamSNo && p1.teamSNo !== p2.teamSNo) {
    return false;
  }

  // 1. Same Email (non-empty)
  const e1 = cleanStr(p1.email);
  const e2 = cleanStr(p2.email);
  if (e1 && e2 && e1 === e2) return true;

  // 2. Same Phone (non-empty)
  const ph1 = normalizePhone(p1.phone);
  const ph2 = normalizePhone(p2.phone);
  if (ph1 && ph2 && ph1.length >= 7 && ph1 === ph2) return true;

  // 3. Name Match or Cross-token similarity
  const n1 = cleanStr(p1.fullName);
  const n2 = cleanStr(p2.fullName);
  if (n1 === n2) return true;

  const words1 = String(p1.fullName).toLowerCase().replace(/[^a-z]/g, ' ').trim().split(/\s+/).filter(w => w.length > 2);
  const words2 = String(p2.fullName).toLowerCase().replace(/[^a-z]/g, ' ').trim().split(/\s+/).filter(w => w.length > 2);

  let matchCount = 0;
  for (const w1 of words1) {
    for (const w2 of words2) {
      if (w1 === w2 || (w1.length > 4 && w2.length > 4 && (w1.includes(w2) || w2.includes(w1)))) {
        matchCount++;
        break;
      }
    }
  }

  if (words1.length > 0 && words2.length > 0 && matchCount >= Math.min(words1.length, words2.length, 2)) {
    return true;
  }

  return false;
}

export function parseExcelWorkbook(data) {
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  if (!rawRows || rawRows.length === 0) {
    throw new Error('The uploaded file is empty.');
  }

  const isHackathonFormat = rawRows.some(row => 
    Array.isArray(row) && row.some(cell => typeof cell === 'string' && (cell.includes('teamLead') || cell.includes('TEAM & PRIMARY CONTACT') || cell.includes('Team Details')))
  );

  if (isHackathonFormat) {
    return parseHackathonFormat(rawRows);
  } else {
    return parseStandardFormat(sheet);
  }
}

function parseHackathonFormat(rawRows) {
  const participants = [];
  let headerRowIndex = 0;

  for (let i = 0; i < Math.min(5, rawRows.length); i++) {
    const rowStr = JSON.stringify(rawRows[i] || []);
    if (rowStr.toLowerCase().includes('team name') || rowStr.toLowerCase().includes('primary member')) {
      headerRowIndex = i;
      break;
    }
  }

  const startRow = headerRowIndex + 1;

  for (let r = startRow; r < rawRows.length; r++) {
    const row = rawRows[r];
    if (!row || row.length === 0) continue;

    const sNo = row[0];
    const teamName = row[1];
    const collegeName = row[2];
    const teamSize = row[3];
    const leadName = row[4];
    const leadEmail = row[5];
    const leadPhone = row[6];
    const totalMarks = row[10] || row[9] || '';
    const teamDetailsRaw = row[12] || row[11] || row[7];

    if (!teamName || String(teamName).toUpperCase().includes('AVERAGE') || isNaN(Number(sNo))) {
      continue;
    }

    const teamIdentifier = String(sNo).padStart(3, '0');
    const cleanTeamName = String(teamName).trim();
    const cleanCollege = collegeName ? String(collegeName).trim() : 'Participant Institute';

    let parsedDetails = null;
    if (typeof teamDetailsRaw === 'string' && teamDetailsRaw.trim().startsWith('{')) {
      try {
        parsedDetails = JSON.parse(teamDetailsRaw);
      } catch (e) {}
    }

    const teamMembers = [];

    // 1. Add Team Lead first
    if (leadName && String(leadName).trim()) {
      const leadObj = {
        id: `part-${participants.length + 1}`,
        sNo: participants.length + 1,
        teamSNo: sNo,
        fullName: String(leadName).trim(),
        collegeName: cleanCollege,
        teamName: cleanTeamName,
        role: 'Team Lead',
        email: leadEmail ? String(leadEmail).trim() : '',
        phone: leadPhone ? String(leadPhone).trim() : '',
        marks: totalMarks,
        certId: `HACK26-${teamIdentifier}-L`,
        teamSize: teamSize || 1
      };
      participants.push(leadObj);
      teamMembers.push(leadObj);
    }

    // 2. Add Members only if not duplicate of Lead or another member in this team
    if (parsedDetails && Array.isArray(parsedDetails.members)) {
      parsedDetails.members.forEach((m, idx) => {
        const mName = m.name ? String(m.name).trim() : '';
        if (!mName) return;

        const candidate = {
          fullName: mName,
          email: m.email || '',
          phone: m.phone || '',
          teamSNo: sNo
        };

        const isDup = teamMembers.some(existing => areParticipantsDuplicate(existing, candidate));

        if (!isDup) {
          const memberObj = {
            id: `part-${participants.length + 1}`,
            sNo: participants.length + 1,
            teamSNo: sNo,
            fullName: mName,
            collegeName: cleanCollege,
            teamName: cleanTeamName,
            role: 'Team Member',
            email: m.email ? String(m.email).trim() : '',
            phone: m.phone ? String(m.phone).trim() : '',
            marks: totalMarks,
            certId: `HACK26-${teamIdentifier}-M${idx + 1}`,
            teamSize: teamSize || parsedDetails.members.length
          };
          participants.push(memberObj);
          teamMembers.push(memberObj);
        }
      });
    }
  }

  return participants;
}

function parseStandardFormat(sheet) {
  const json = XLSX.utils.sheet_to_json(sheet);
  if (!json || json.length === 0) return [];

  const participants = [];
  const seen = new Set();

  json.forEach((row, index) => {
    let fullName = '';
    let collegeName = '';
    let teamName = '';
    let role = 'Participant';
    let email = '';
    let phone = '';
    let certId = '';

    Object.entries(row).forEach(([key, val]) => {
      const norm = cleanStr(key);
      const strVal = String(val || '').trim();
      if (['fullname', 'name', 'studentname', 'participantname', 'candidatename', 'leadname', 'membername'].includes(norm)) {
        if (!fullName) fullName = strVal;
      } else if (['college', 'collegename', 'institution', 'university', 'organization', 'school'].includes(norm)) {
        if (!collegeName) collegeName = strVal;
      } else if (['team', 'teamname', 'group', 'groupname', 'project'].includes(norm)) {
        if (!teamName) teamName = strVal;
      } else if (['role', 'designation', 'position', 'teamrole'].includes(norm)) {
        if (strVal) role = strVal;
      } else if (['email', 'emailaddress', 'mail'].includes(norm)) {
        if (!email) email = strVal;
      } else if (['phone', 'phonenumber', 'mobile', 'contact'].includes(norm)) {
        if (!phone) phone = strVal;
      } else if (['certid', 'certificateid', 'id', 'ticketno', 'registrationid'].includes(norm)) {
        if (!certId) certId = strVal;
      }
    });

    if (fullName) {
      const key = `${cleanStr(fullName)}_${cleanStr(teamName)}`;
      if (!seen.has(key)) {
        seen.add(key);
        participants.push({
          id: `part-${index + 1}`,
          sNo: index + 1,
          teamSNo: index + 1,
          fullName: fullName,
          collegeName: collegeName || 'Participant Institute',
          teamName: teamName || 'Individual',
          role: role || 'Participant',
          email: email,
          phone: phone,
          marks: '',
          certId: certId || `CERT-${String(index + 1).padStart(4, '0')}`,
          teamSize: 1
        });
      }
    }
  });

  return participants;
}
