// leaveDateUtils.js (recommended filename)

export const formatLeaveMonth = (date) =>
  date.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();

export const getLeaveWeekDates = (baseDate) => {
  const start = new Date(baseDate);
  const day = start.getDay();
  const diffToMonday = (day + 6) % 7;
  start.setDate(start.getDate() - diffToMonday);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

export const getLeaveMonthDates = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(year, month, i + 1);
  });
};
