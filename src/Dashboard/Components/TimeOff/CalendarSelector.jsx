import React from 'react';

export default function Calendar({
  month,
  year,
  onDateClick,
  startDate,
  endDate,
  hoverDate,
  setHoverDate
}) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const startTimestamp = startDate ? new Date(startDate).getTime() : null;
  const endTimestamp = endDate ? new Date(endDate).getTime() : null;

  const effectiveEnd =
    !endDate && hoverDate && startTimestamp && hoverDate >= startTimestamp
      ? hoverDate
      : endTimestamp;

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const isAdjacent = startTimestamp && effectiveEnd && effectiveEnd - startTimestamp === ONE_DAY;

  return (
    <div className="grid grid-cols-7 text-center text-xs gap-y-1">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} className="text-sm px-2 text-gray-600">{day}</div>
      ))}
      {days.map((date, index) => {
        if (date === null) return <div key={index} />;

        const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        const currentTimestamp = new Date(currentDateStr).getTime();

        const inRange =
          startTimestamp &&
          effectiveEnd &&
          currentTimestamp >= Math.min(startTimestamp, effectiveEnd) &&
          currentTimestamp <= Math.max(startTimestamp, effectiveEnd);

        const isStart = currentTimestamp === startTimestamp;
        const isEnd = currentTimestamp === endTimestamp;
        const isHoverEnd = !endDate && hoverDate && currentTimestamp === hoverDate;

        const isToday =
          new Date().getDate() === date &&
          new Date().getMonth() === month &&
          new Date().getFullYear() === year;

        let classes = "cursor-pointer text-sm py-1 px-1 text-gray-800 ";

        if (inRange) classes += "bg-teal-100 ";

        if (isStart && (isEnd || isHoverEnd)) {
          classes += "bg-teal-700 text-white font-bold rounded-sm ";
        } else if (isStart) {
          classes += isAdjacent
            ? "bg-teal-700 text-white font-bold rounded-l-sm "
            : "bg-teal-700 text-white font-bold rounded-sm ";
        } else if (isEnd || isHoverEnd) {
          classes += isAdjacent
            ? "bg-teal-700 text-white font-bold rounded-r-sm "
            : "bg-teal-700 text-white font-bold rounded-sm ";
        } else if (inRange) {
          classes += "rounded-none ";
        } else {
          classes += "rounded-sm ";
        }

        if (isToday && !inRange && !isStart && !(isEnd || isHoverEnd)) {
          classes += " border border-teal-600 ";
        }

        classes += isStart || isEnd || isHoverEnd
          ? "hover:bg-gray-500 "
          : "hover:bg-teal-500 ";

        return (
          <div
            key={index}
            onClick={() => onDateClick(currentDateStr)}
            onMouseEnter={() => {
              if (startTimestamp && !endDate && currentTimestamp >= startTimestamp) {
                setHoverDate(currentTimestamp);
              }
            }}
            onMouseLeave={() => setHoverDate(null)}
            className={classes}
          >
            {date}
          </div>
        );
      })}
    </div>
  );
}
