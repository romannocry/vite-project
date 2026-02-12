import type { Enrichment, RawMeeting } from "./DataTypes";

function publicUrl(path: string) {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/+$/, "/");
  const rel = path.replace(/^\//, "");
  return `${base}${rel}`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to load ${url} (${res.status}): ${text || res.statusText}`);
  }

  return (await res.json()) as T;
}

// Fixtures loader (today). Swap internals to real endpoints later.
export async function loadMeetings(): Promise<RawMeeting[]> {
  return await fetchJson<RawMeeting[]>(publicUrl("fixtures/meetings.json"));
}

export async function loadEnrichment(): Promise<Enrichment[]> {
  return await fetchJson<Enrichment[]>(publicUrl("fixtures/enrichment.json"));
}

export async function loadHeatmapFixtures(): Promise<{
  meetings: RawMeeting[];
  enrichment: Enrichment[];
}> {
  const [meetings, enrichment] = await Promise.all([loadMeetings(), loadEnrichment()]);
  return { meetings, enrichment };
}

export async function postEnrichment(record: Enrichment): Promise<void> {
  // Dummy API call placeholder.
  // Replace with a real `fetch()` call when the backend endpoint exists.
  console.log("[dummy api] POST /enrichment", record);

  // Simulate async behavior so the UI flow matches a real network call.
  await new Promise<void>((resolve) => setTimeout(resolve, 150));
}
