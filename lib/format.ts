import type { Period } from "./schemas/common";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2024-11" → "Nov 2024"; "2019" → "2019". Never invents a month. */
export function formatPartialDate(value: string) {
  const [year, month] = value.split("-");
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

export function formatPeriod(period: Period) {
  return `${formatPartialDate(period.start)} – ${period.end ? formatPartialDate(period.end) : "Present"}`;
}

/**
 * Length of a closed, month-precise period, counting both end months like
 * LinkedIn: Jul 2024 – Mar 2026 → "1 yr 9 mos". null when it can't be exact.
 */
export function formatDuration({ start, end }: Period) {
  if (!end) return null;
  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);
  if (!startMonth || !endMonth) return null;

  const months = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  if (months < 1) return null;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [years && `${years} yr${years > 1 ? "s" : ""}`, rest && `${rest} mo${rest > 1 ? "s" : ""}`]
    .filter(Boolean)
    .join(" ");
}
