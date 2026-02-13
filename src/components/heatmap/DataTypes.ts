export interface RawMeeting {
  created_at: string;
  id: string;
  "iC ID Top Account": string;
  client_name?: string;
  // Legacy field kept for backward compatibility; the UI now keys on "Author Region".
  country?: string;
  "Author Region"?: string;
  activityDate?: string;
  participant_team: string;
  status?: "live" | "on hold" | "abandonned" | "onboarding in progress" | "test" | "";
}

export interface Enrichment {
  created_at: string;
  "iC ID Top Account": string;
  "Author Region"?: string;
  participant_team: string;
  comment?: string;
  potential_revenue?: number;
  feeling?: "positive" | "neutral" | "negative";
  status?: "live" | "on hold" | "abandonned" | "onboarding in progress" | "";
}
