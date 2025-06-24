import React, { useState } from "react";
import { ChevronLeft, Info, Upload } from "lucide-react";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthYearString(date) {
  return date.toLocaleString("default", { month: "short", year: "numeric" }); // e.g. Dec 2024
}

export default function InteractiveCalendar() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [fromTime, setFromTime] = useState("09:00");
  const [toTime, setToTime] = useState("10:00");

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayWeekday = currentMonth.getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayWeekday; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const goToPreviousMonth = () => setCurrentMonth(new Date(year, month - 1, 1));

  const selectDay = (day) => {
    if (!day) return;
    setSelectedDate(new Date(year, month, day));
  };

  const formatDateDisplay = (date) =>
    date.toLocaleDateString("default", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <>
      {/* Header with buttons */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-medium text-gray-700">Request Time Off</p>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:underline">Cancel</button>
          <button className="px-4 py-1 rounded-2xl border border-gray-300 hover:bg-gray-100">
            Request Time Off
          </button>
        </div>
      </div>

      {/* Date Range Info Box */}
      <div className="bg-gray-100 px-4 py-2 rounded text-sm text-gray-700 mb-6">
        {formatDateDisplay(selectedDate)} ({fromTime}) → {formatDateDisplay(selectedDate)} ({toTime})
      </div>

      {/* Calendar and Time Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={goToPreviousMonth}
              className="text-gray-600 p-1 hover:bg-gray-200 rounded"
              aria-label="Previous Month"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-gray-700 font-medium">{getMonthYearString(currentMonth)}</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-gray-500 text-xs mb-1">
            {DAYS.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-gray-700">
            {calendarDays.map((day, i) =>
              day ? (
                <div
                  key={i}
                  onClick={() => selectDay(day)}
                  className={`py-2 rounded cursor-pointer hover:bg-gray-200 ${selectedDate.getDate() === day &&
                      selectedDate.getMonth() === month &&
                      selectedDate.getFullYear() === year
                      ? "bg-blue-500 text-white"
                      : ""
                    }`}
                >
                  {day}
                </div>
              ) : (
                <div key={i} />
              )
            )}
          </div>
        </div>

        {/* Date and Time Inputs */}
        <div className="space-y-4 px-6">
          <div>
            <label className="block text-gray-500 mb-1">From</label>
            <div className="bg-gray-100 p-2 rounded w-full mb-2 text-sm text-gray-700">
              {formatDateDisplay(selectedDate)}
            </div>
            <select
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className="bg-gray-100 p-2 rounded w-full text-sm"
            >
              <option>09:00</option>
              <option>10:00</option>
              <option>11:00</option>
              <option>12:00</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-500 mb-1">To</label>
            <div className="bg-gray-100 p-2 rounded w-full mb-2 text-sm text-gray-700">
              {formatDateDisplay(selectedDate)}
            </div>
            <select
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className="bg-gray-100 p-2 rounded w-full text-sm"
            >
              <option>10:00</option>
              <option>11:00</option>
              <option>12:00</option>
              <option>13:00</option>
            </select>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="text-sm bg-gray-100 border border-[#FDE68A] rounded-md px-4 py-2 flex items-start space-x-2">
        <Info size={16} className="mt-0.5" />
        <span>
          You’re requesting <span className="font-medium">9 hours</span> off. You’ll have{" "}
          <span className="font-medium">31 hours</span> of sick leave remaining.
        </span>
      </div>

      {/* Upload */}
      <div>
        <label className="block text-gray-500 mb-1">Upload Attachment</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-400">
          <Upload size={36} className="mx-auto mb-2" />
          <div className="text-sm">Upload a file or drop here</div>
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-600">
          Save
        </button>
      </div>
    </>
  );
}
