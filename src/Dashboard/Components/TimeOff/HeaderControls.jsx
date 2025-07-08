import React from "react";
import { Filter, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function HeaderControls({
  viewMode,
  switchToWeekView,
  switchToMonthView,
  goToPrev,
  goToNext,
  formatMonth,
  currentDate,
  weekMenuOpen,
  setWeekMenuOpen,
  selectedWeekLabel,
  goToWeek,
  typeMenuOpen,
  setTypeMenuOpen,
  selectedType,
  setSelectedType,
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-[#f6f3fc] flex-wrap gap-3">
      {/* Left side - Time Off Type Filter */}
      <div className="flex items-center flex-wrap gap-2 text-sm">
        <div className="relative">
          <button
            onClick={() => setTypeMenuOpen(!typeMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ede9f7] text-sm text-gray-600"
          >
            <Filter className="w-4 h-4" /> Type{" "}
            <span className="font-medium ml-0.5 text-sm">{selectedType}</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>

          {typeMenuOpen && (
            <div className="absolute left-0 mt-1 bg-white border border-gray-200 rounded shadow z-10 w-44">
              {["All", "Unpaid Leave", "Sick Leave", "Paid time off"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setTypeMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side - View Controls */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={switchToWeekView}
          className={`px-4 py-1.5 rounded-full ${
            viewMode === "week"
              ? "bg-white text-gray-900 font-semibold shadow-sm border"
              : "bg-[#ede9f7] text-gray-600"
          }`}
        >
          Week
        </button>
        <button
          onClick={switchToMonthView}
          className={`px-4 py-1.5 rounded-full ${
            viewMode === "month"
              ? "bg-white text-gray-900 font-semibold shadow-sm border"
              : "bg-[#ede9f7] text-gray-600"
          }`}
        >
          Month
        </button>

        {viewMode === "month" ? (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-[#ede9f7] text-gray-700 font-medium" style={{ width: "150px", justifyContent: "space-between" }}>
            <button onClick={goToPrev}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-center text-sm w-full">
              {formatMonth(currentDate)}
            </span>
            <button onClick={goToNext}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setWeekMenuOpen(!weekMenuOpen)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-[#ede9f7] text-gray-700 font-medium"
            >
              {selectedWeekLabel} <ChevronDown className="w-4 h-4" />
            </button>

            {weekMenuOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded shadow z-10 w-40">
                <button
                  onClick={() => {
                    goToWeek(-1);
                    setWeekMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Last Week
                </button>
                <button
                  onClick={() => {
                    goToWeek(0);
                    setWeekMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Current Week
                </button>
                <button
                  onClick={() => {
                    goToWeek(1);
                    setWeekMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Next Week
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
