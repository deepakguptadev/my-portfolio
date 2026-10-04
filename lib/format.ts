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
