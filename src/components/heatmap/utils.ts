export function getISOWeekYear(d: Date) {
  // Use UTC getters to avoid timezone shifting (e.g. UTC Monday showing as local Sunday)
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNr = (date.getUTCDay() + 6) % 7; // Monday=0, Sunday=6
  date.setUTCDate(date.getUTCDate() - dayNr + 3);
  const year = date.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(year, 0, 4));
  const week =
    1 +
    Math.round(
      ((date.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7
    );
  return { year, week };
}

export const formatDateUTC = (d: Date) => {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const formatDateLocal = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const formatCreatedAtLocal = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}.${ms}`;
};

export const parseCreatedAtLocal = (createdAt: string) => {
  // Expected: "YYYY-MM-DD HH:mm:ss.SSS" (no timezone). Parse as local time.
  const s = (createdAt ?? "").trim();
  if (!s) return new Date(NaN);

  const m =
    /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/.exec(s);
  if (m) {
    const year = Number(m[1]);
    const month0 = Number(m[2]) - 1;
    const day = Number(m[3]);
    const hour = Number(m[4] ?? 0);
    const minute = Number(m[5] ?? 0);
    const second = Number(m[6] ?? 0);
    const msRaw = m[7] ?? "0";
    const ms = Number(msRaw.padEnd(3, "0").slice(0, 3));
    return new Date(year, month0, day, hour, minute, second, ms);
  }

  // Fallback: try to coerce "YYYY-MM-DD HH:mm:ss.SSS" → ISO-like "YYYY-MM-DDTHH:mm:ss.SSS"
  const coerced = s.includes("T") ? s : s.replace(" ", "T");
  return new Date(coerced);
};

export const formatDatetimeLocalInput = (d: Date) => {
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
};

export const parseDatetimeLocalInput = (value: string) => {
  const s = (value ?? "").trim();
  if (!s) return new Date(NaN);

  // Accept "YYYY-MM-DDTHH:mm" (browser datetime-local)
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(s);
  if (m) {
    const year = Number(m[1]);
    const month0 = Number(m[2]) - 1;
    const day = Number(m[3]);
    const hour = Number(m[4]);
    const minute = Number(m[5]);
    return new Date(year, month0, day, hour, minute, 0, 0);
  }

  // Accept "YYYY-MM-DD" as midnight local
  const md = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (md) {
    const year = Number(md[1]);
    const month0 = Number(md[2]) - 1;
    const day = Number(md[3]);
    return new Date(year, month0, day, 0, 0, 0, 0);
  }

  return new Date(s);
};

export const startOfISOWeekUTC = (d: Date) => {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = (date.getUTCDay() + 6) % 7; // Monday=0
  date.setUTCDate(date.getUTCDate() - day);
  return date;
};

export const formatSinceDays = (days: number) => {
  if (!Number.isFinite(days)) return "—";
  if (days < 0) return "0d";
  return `${days}d`;
};
