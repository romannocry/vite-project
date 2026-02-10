type LegacyRawMeeting = {
  date: string;
  meeting_id: number;
  client_id: number;
  client_name?: string;
  participant_team: string;
  status?: "live" | "on hold" | "abandonned" | "";
};

export interface RawMeeting {
  created_at: string;
  id: string;
  "iC ID Top Account": string;
  client_name?: string;
  participant_team: string;
  status?: "live" | "on hold" | "abandonned" | "";
}

const legacyMeetings: LegacyRawMeeting[] = [
  // 2025 (ISO weeks 01–34)
  // Note: ISO week 01 of 2025 starts on 2024-12-30.
  { date: '2024-12-30', meeting_id: 5601, client_id: 7001, participant_team: 'Team1' },
  { date: '2025-01-06', meeting_id: 5602, client_id: 7002, participant_team: 'Team2' },
  { date: '2025-01-13', meeting_id: 5603, client_id: 7003, participant_team: 'Team3' },
  { date: '2025-01-20', meeting_id: 5604, client_id: 7004, participant_team: 'Team4' },
  { date: '2025-01-27', meeting_id: 5605, client_id: 7005, participant_team: 'Team1,Team3'},
  { date: '2025-02-03', meeting_id: 5606, client_id: 6543, participant_team: 'Team2,Team4' },
  { date: '2025-02-10', meeting_id: 5607, client_id: 7001, participant_team: 'Team6' },
  { date: '2025-02-17', meeting_id: 5608, client_id: 7002, participant_team: 'Team7' },
  { date: '2025-02-24', meeting_id: 5609, client_id: 7003, participant_team: 'Team8' },
  { date: '2025-03-03', meeting_id: 5610, client_id: 7004, participant_team: 'Team2' },
  { date: '2025-03-10', meeting_id: 5611, client_id: 7005, participant_team: 'Team3' },
  { date: '2025-03-17', meeting_id: 5612, client_id: 7001, participant_team: 'Team1' },
  { date: '2025-03-24', meeting_id: 5613, client_id: 7002, client_name: 'Client Name', participant_team: 'Team4' },
  { date: '2025-03-31', meeting_id: 5614, client_id: 7003, participant_team: 'Team2,Team3' },
  { date: '2025-04-07', meeting_id: 5615, client_id: 7004, participant_team: 'Team1,Team4' },
  { date: '2025-04-14', meeting_id: 5616, client_id: 7005, participant_team: 'Team6' },
  { date: '2025-04-21', meeting_id: 5617, client_id: 6543, participant_team: 'Team7' },
  { date: '2025-04-28', meeting_id: 5618, client_id: 7001, participant_team: 'Team8' },
  { date: '2025-05-05', meeting_id: 5619, client_id: 7002, participant_team: 'Team1,Team2' },
  { date: '2025-05-12', meeting_id: 5620, client_id: 7003, participant_team: 'Team3,Team4' },
  { date: '2025-05-19', meeting_id: 5621, client_id: 7004, participant_team: 'Team2' },
  { date: '2025-05-26', meeting_id: 5622, client_id: 7005, participant_team: 'Team1' },
  { date: '2025-06-02', meeting_id: 5623, client_id: 7001, participant_team: 'Team3' },
  { date: '2025-06-09', meeting_id: 5624, client_id: 7002, participant_team: 'Team4' },
  { date: '2025-06-16', meeting_id: 5625, client_id: 7003, participant_team: 'Team6' },
  { date: '2025-06-23', meeting_id: 5626, client_id: 7004, participant_team: 'Team7' },
  { date: '2025-06-30', meeting_id: 5627, client_id: 7005, participant_team: 'Team8' },
  { date: '2025-07-07', meeting_id: 5628, client_id: 6543, participant_team: 'Team2,Team4' },
  { date: '2025-07-14', meeting_id: 5629, client_id: 7001, participant_team: 'Team1,Team3' },
  { date: '2025-07-21', meeting_id: 5630, client_id: 7002, participant_team: 'Team2' },
  { date: '2025-07-28', meeting_id: 5631, client_id: 7003, participant_team: 'Team3' },
  { date: '2025-08-04', meeting_id: 5632, client_id: 7004, participant_team: 'Team4' },
  { date: '2025-08-11', meeting_id: 5633, client_id: 7005, participant_team: 'Team6' },
  { date: '2025-08-18', meeting_id: 5634, client_id: 7001, participant_team: 'Team7' },

  // 2025 (ISO weeks 35–44)
  { date: '2025-08-25', meeting_id: 5901, client_id: 7001, participant_team: 'Team1' },
  { date: '2025-09-01', meeting_id: 5902, client_id: 7002, participant_team: 'Team2' },
  { date: '2025-09-08', meeting_id: 5903, client_id: 7003, participant_team: 'Team3' },
  { date: '2025-09-15', meeting_id: 5904, client_id: 7004, participant_team: 'Team4' },
  { date: '2025-09-22', meeting_id: 5905, client_id: 7005, participant_team: 'Team2,Team4' },
  { date: '2025-09-29', meeting_id: 5906, client_id: 7001, participant_team: 'Team6' },
  { date: '2025-10-06', meeting_id: 5907, client_id: 7002, participant_team: 'Team7' },
  { date: '2025-10-13', meeting_id: 5908, client_id: 7003, participant_team: 'Team8' },
  { date: '2025-10-20', meeting_id: 5909, client_id: 6543, participant_team: 'Team1,Team3' },
  { date: '2025-10-27', meeting_id: 5910, client_id: 7004, participant_team: 'Team2' },

  // 2025 (ISO weeks 45–52)
  { date: '2025-11-04', meeting_id: 6001, client_id: 7001, participant_team: 'Team2' },
  { date: '2025-11-12', meeting_id: 6002, client_id: 7002, participant_team: 'Team4' },
  { date: '2025-11-21', meeting_id: 6003, client_id: 7003, participant_team: 'Team1,Team3' },
  { date: '2025-12-02', meeting_id: 6004, client_id: 7001, participant_team: 'Team6' },
  { date: '2025-12-10', meeting_id: 6005, client_id: 7004, participant_team: 'Team2' },
  { date: '2025-12-18', meeting_id: 6006, client_id: 7005, participant_team: 'Team3' },
  { date: '2025-12-23', meeting_id: 6007, client_id: 6543, participant_team: 'Team4' },
  { date: '2025-12-27', meeting_id: 6008, client_id: 7001, participant_team: 'Team7' },

  // 2026 (up to current date: 2026-02-07)
  { date: '2026-01-01', meeting_id: 4343, client_id: 6543, participant_team: 'Team1', status: 'live' },
  { date: '2026-01-01', meeting_id: 4124, client_id: 6543, participant_team: 'Team4', status: 'live' },
  { date: '2026-02-07', meeting_id: 1234, client_id: 6543, participant_team: 'Team1,Team2,Team3' },
  { date: '2026-01-05', meeting_id: 5001, client_id: 7001, participant_team: 'Team2' },
  { date: '2026-01-06', meeting_id: 5002, client_id: 7002, participant_team: 'Team3' },
  { date: '2026-01-07', meeting_id: 5003, client_id: 7003, participant_team: 'Team1' },
  { date: '2026-01-08', meeting_id: 5004, client_id: 7004, participant_team: 'Team2,Team4' },
  { date: '2026-01-09', meeting_id: 5005, client_id: 7005, participant_team: 'Team3' },
  { date: '2026-01-10', meeting_id: 5006, client_id: 7001, participant_team: 'Team1' },
  { date: '2026-01-11', meeting_id: 5007, client_id: 7002, participant_team: 'Team4' },
  { date: '2026-01-12', meeting_id: 5008, client_id: 7003, participant_team: 'Team2' },
  { date: '2026-01-13', meeting_id: 5009, client_id: 7004, participant_team: 'Team1,Team3' },
  { date: '2026-01-14', meeting_id: 5010, client_id: 7005, participant_team: 'Team2' },
  { date: '2026-01-15', meeting_id: 5011, client_id: 7001, participant_team: 'Team3' },
  { date: '2026-01-16', meeting_id: 5012, client_id: 7002, participant_team: 'Team1' },
  { date: '2026-01-17', meeting_id: 5013, client_id: 7003, participant_team: 'Team4' },
  { date: '2026-01-18', meeting_id: 5014, client_id: 7004, participant_team: 'Team2' },
  { date: '2026-01-19', meeting_id: 5015, client_id: 7005, participant_team: 'Team1' },
  { date: '2026-01-20', meeting_id: 5016, client_id: 7001, participant_team: 'Team3' },
  { date: '2026-01-21', meeting_id: 5017, client_id: 7002, participant_team: 'Team2,Team4' },
  { date: '2026-01-22', meeting_id: 5018, client_id: 7003, participant_team: 'Team1' },
  { date: '2026-01-23', meeting_id: 5019, client_id: 7004, participant_team: 'Team3' },
  { date: '2026-01-24', meeting_id: 5020, client_id: 7005, participant_team: 'Team2' },
  { date: '2026-01-25', meeting_id: 5021, client_id: 7001, participant_team: 'Team1' },
  { date: '2026-01-26', meeting_id: 5022, client_id: 7002, participant_team: 'Team4' },
  { date: '2026-01-27', meeting_id: 5023, client_id: 7003, participant_team: 'Team2' },
  { date: '2026-01-28', meeting_id: 5024, client_id: 7004, participant_team: 'Team3' },
  { date: '2026-01-29', meeting_id: 5025, client_id: 7005, participant_team: 'Team1' },
  { date: '2026-01-30', meeting_id: 5026, client_id: 7001, participant_team: 'Team2,Team3' },
  { date: '2026-01-31', meeting_id: 5027, client_id: 7002, participant_team: 'Team4' },
  { date: '2026-02-01', meeting_id: 5034, client_id: 7003, participant_team: 'Team1' },
  { date: '2026-02-02', meeting_id: 5035, client_id: 7004, participant_team: 'Team2' },
  { date: '2026-02-03', meeting_id: 5030, client_id: 7005, participant_team: 'Team3' },
  
];

export const meetings: RawMeeting[] = legacyMeetings.map((m) => ({
  created_at: `${m.date} 00:00:00.000`,
  id: String(m.meeting_id),
  "iC ID Top Account": String(m.client_id),
  client_name: m.client_name,
  participant_team: m.participant_team,
  status: m.status,
}));

export const meetingsExtended: RawMeeting[] = meetings;

type LegacyEnrichment = {
  date: string;
  client_id: number;
  participant_team: string;
  comment?: string;
  feeling?: "positive" | "neutral" | "negative";
  status?: "live" | "on hold" | "abandonned" | "";
};

export interface Enrichment {
  created_at: string;
  "iC ID Top Account": string;
  participant_team: string;
  comment?: string;
  feeling?: "positive" | "neutral" | "negative";
  status?: "live" | "on hold" | "abandonned" | "";
}

const legacyEnrichment: LegacyEnrichment[] = [
  // 2025 (ISO weeks 01–34)
  // Note: ISO week 01 of 2025 starts on 2024-12-30.
  { date: '2026-02-02', client_id: 7001, participant_team: 'Team1', comment: 'test', status: 'live' },
  { date: '2026-02-03', client_id: 7001, participant_team: 'Team1', comment: 'test', status: 'abandonned' },
  { date: '2026-02-02', client_id: 7002, participant_team: 'Team4', comment: 'test', status: 'live' },
  { date: '2026-02-02', client_id: 7003, participant_team: 'Team2', comment: 'test' },
  { date: '2026-02-02', client_id: 7004, participant_team: 'Team2', comment: 'test' },
  { date: '2026-02-02', client_id: 7003, participant_team: 'Team8', comment: 'test' },
  { date: '2026-01-14', client_id: 7003, participant_team: 'Team8', comment: 'test' },
  { date: '2026-01-14', client_id: 6543, participant_team: 'Team4', comment: 'test' },
  { date: '2026-01-14', client_id: 6543, participant_team: 'Team4', comment: 'test 2' },
  { date: '2026-01-08', client_id: 7001, participant_team: 'Team7', comment: 'test 2', status: '' },

];

export const enrichment: Enrichment[] = legacyEnrichment.map((e) => ({
  created_at: `${e.date} 00:00:00.000`,
  "iC ID Top Account": String(e.client_id),
  participant_team: e.participant_team,
  comment: e.comment,
  feeling: e.feeling,
  status: e.status,
}));