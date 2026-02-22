export interface RawMeeting {
  created_at: string;
  id: string;
  "iC ID Top Account": string;
  // Legacy name field kept for backward compatibility with older fixtures.
  client_name?: string;
  // Actual client display name field in the raw meetings export.
  "Top Account"?: string;
  // Legacy field kept for backward compatibility; the UI now keys on "Author Region".
  country?: string;
  "Author Region"?: string;
  activityDate?: string;
  participant_team: string;
  bernstein_team?: string;
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
