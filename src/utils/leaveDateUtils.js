// leaveDateUtils.js

export const formatLeaveMonth = (date) =>
  date
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();

export const getLeaveWeekDates = (baseDate) => {
  const date = new Date(baseDate);
  const day = date.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }); // Example: 28 Jun 2025
};

export const formatFullDate = (date) => {
  if (!date) return "";
  return new Date(date)
    .toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/,/g, "");
}; // Example: Saturday 28 Jun 2025

export const getLeaveMonthDates = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(year, month, i + 1);
  });
};

/**
 * Calculates number of leave days between two dates.
 * If first/last day types are 'half', adjusts accordingly.
 */
export const calculateRequestedDays = (
  startDate,
  endDate,
  firstDayType = "full",
  lastDayType = "full"
) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInMs = end - start;
  const totalDays = diffInMs / (1000 * 60 * 60 * 24) + 1;

  let days = totalDays;
  if (firstDayType === "half") days -= 0.5;
  if (lastDayType === "half") days -= 0.5;

  return days;
};

export const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); // Clear time part
  return d;
};
