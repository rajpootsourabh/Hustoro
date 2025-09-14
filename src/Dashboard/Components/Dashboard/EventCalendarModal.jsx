import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  startOfDay,
  isBefore,
} from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import axios from "axios";

const EventCalendarModal = ({ isOpen, onClose, onSubmit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const isSelectableDate = selectedDate.getDay() !== 0; // Sunday = 0
  const [hasSelectedDate, setHasSelectedDate] = useState(false);
  const [showCustomTimeInput, setShowCustomTimeInput] = useState(false);
  const [error, setError] = useState("");


  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">Events</h2>
      <button onClick={handleClose} className="text-gray-600 hover:text-black">
        <X size={20} />
      </button>
    </div>
  );

  const handleClose = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
    setTime("");
    setTitle("");
    setDescription("");
    setHasSelectedDate(false);
    setShowCustomTimeInput(false);
    onClose();
  };


  const renderCalendarHeader = () => (
    <div className="flex items-center justify-center gap-6 py-2">
      <button
        onClick={() => setCurrentDate(subMonths(currentDate, 1))}
        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="text-lg font-medium">{format(currentDate, "MMMM yyyy")}</span>
      <button
        onClick={() => setCurrentDate(addMonths(currentDate, 1))}
        className="w-8 h-8 rounded-full bg-[#007a6e] text-white flex items-center justify-center hover:bg-[#005f56]"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-sm text-gray-600">
          {weekdays[i]}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const isSelected = isSameDay(day, selectedDate);
        const today = startOfDay(new Date());
        const currentDay = startOfDay(day);
        const isToday = isSameDay(currentDay, today);
        const isPast = isBefore(currentDay, today);
        const isDisabled = !isToday && isPast;

        days.push(
          <div
            key={day}
            onClick={() => {
              if (!isDisabled) {
                setSelectedDate(cloneDay);
                setHasSelectedDate(true);
              }
            }}
            className={`text-sm w-10 h-10 mx-auto flex items-center justify-center rounded-full 
    ${isDisabled ? "text-gray-300 cursor-not-allowed" :
                !isSameMonth(day, monthStart) ? "text-gray-300 cursor-pointer" : "text-gray-800 cursor-pointer"}
    ${isToday ? "bg-[#007a6e] text-white" : ""}
    ${isSelected && !isToday ? "bg-gray-200" : ""}
  `}
          >
            {format(day, "d")}
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day} className="grid grid-cols-7 gap-y-2">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-2">{rows}</div>;
  };

  const handleCreateEvent = async () => {
    if (!title.trim()) {
      setError("Event title is required.");
      return;
    }
    if (!hasSelectedDate) {
      setError("Please select a valid date.");
      return;
    }

    if (!time) {
      setError("Please select a time.");
      return;
    }

    setError("");

    try {
      const token = localStorage.getItem("access_token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/events`,
        {
          title,
          description,
          date: format(selectedDate, "yyyy-MM-dd"),
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (onSubmit) {
        onSubmit({
          ...res.data,
          date: new Date(`${res.data.date}T${res.data.time}`),
        });
      }

      handleClose();
    } catch (err) {
      console.error("Failed to create event", err);
      alert("Something went wrong while creating the event.");
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] p-6 shadow-xl">

        {renderHeader()}
        <div className="flex gap-6 h-[calc(90vh-5rem)]">


          {/* Calendar */}
          <div className="w-1/2">
            {renderCalendarHeader()}
            {renderDays()}
            {renderCells()}
          </div>

          {/* Event Form */}
          <div className="w-1/2 pl-8 border-l border-dashed border-gray-300 flex flex-col relative">
            <div className="overflow-y-auto pr-2 scrollbar-enhanced pb-10">
              {error && (
                <p className="text-sm text-red-500  pb-2">{error}</p>
              )}
              <h3 className="text-sm font-medium mb-4 text-gray-700">
                Add Event - {format(selectedDate, "d MMMM yyyy")}
              </h3>
              <input
                type="text"
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-3 border p-2 rounded w-full text-sm"
              />
              <textarea
                placeholder="Event Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mb-3 border p-2 rounded w-full text-sm resize-none"
              />

              {hasSelectedDate ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  {!showCustomTimeInput && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {Array.from({ length: 14 }, (_, i) => {
                        const hour = 9 + Math.floor(i / 2); // 9 to 15 (3:30 PM)
                        const minutes = i % 2 === 0 ? "00" : "30";
                        const value = `${hour.toString().padStart(2, "0")}:${minutes}`;
                        const display = format(new Date(`1970-01-01T${value}`), "h:mm a");

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              setTime(value);
                              setShowCustomTimeInput(false);
                            }}
                            className={`text-sm border rounded px-2 py-1 ${time === value
                              ? "bg-[#007a6e] text-white border-[#007a6e]"
                              : "border-gray-300 text-gray-700 hover:bg-gray-100"
                              } transition`}
                          >
                            {display}
                          </button>
                        );
                      })}
                    </div>
                  )}


                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomTimeInput(true);
                      setTime("");
                    }}

                    className="text-sm text-[#007a6e] hover:underline mb-1"
                  >
                    + Custom Time
                  </button>

                  {showCustomTimeInput && (
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => {
                        setTime(e.target.value);
                        setShowCustomTimeInput(true); // force hide prebuilt options
                      }}
                      className="mt-2 border border-gray-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#007a6e]"
                    />
                  )}

                </div>

              ) : hasSelectedDate ? (
                <p className="text-xs text-red-500 mb-3">⚠️ Cannot schedule events on Sundays.</p>
              ) : null}
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-white pt-3 pb-4 pr-2">

              <div className="flex justify-center">
                <button
                  onClick={handleCreateEvent}
                  className="bg-[#007a6e] text-white py-2 px-5 rounded-full text-sm font-semibold hover:bg-[#005f56] max-w-[350px] w-full"
                >
                  Create Event
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default EventCalendarModal;