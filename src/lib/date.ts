/**
 * Local date formatting utilities to prevent UTC day-shift bugs.
 */

export const formatLocalYMD = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseLocalDate = (ymd: string): Date => {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
};

export const formatDisplayDate = (value: string): string => {
  if (!value) return "";
  const d = value.includes("T") ? new Date(value) : parseLocalDate(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
};

export const formatDateTimeDisplay = (value: string): string => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return formatDisplayDate(value);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
