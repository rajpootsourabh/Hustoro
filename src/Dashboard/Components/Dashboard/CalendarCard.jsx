import React from "react";
import { CalendarDays } from "lucide-react";

const CalendarCard = () => {
  const tabs = [
    { label: "Events", count: 1, active: true },
    { label: "Celebration", count: 0 },
    { label: "Holiday", count: 0 },
  ];

  const meetings = [
    { time: "11:00 AM", title: "Induction Meeting" },
    { time: "12:00 AM", title: "Interview Meeting with Candidate" },
    { time: "12:00 AM", title: "Interview Meeting with Candidate" },
    { time: "12:00 AM", title: "Interview Meeting with Candidate" },
  ];

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="flex items-center gap-3 px-6 py-4 border-b">
        <div className="w-10 h-10 bg-[#007a6e] rounded-full flex items-center justify-center text-white">
          <CalendarDays className="w-5 h-5" />
        </div>
        <p className="text-sm text-gray-800">Wednesday 23 Jan, 2025</p>
      </div>
      <div className="flex p-6 gap-6">
        {/* Tabs */}
        <div className="space-y-4 w-36">
          {tabs.map((tab, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-1.5 rounded-full text-sm font-medium ${tab.active
                  ? "bg-[#007a6e] text-white"
                  : "bg-[#F3F7F8] text-[#757575]"
                }`}
            >
              <span className="text-sm">{tab.label}</span>
              <span
                className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center ${tab.active
                    ? "bg-[#0e079a] text-white"
                    : "bg-[#D6EBF2] text-[#757575]"
                  }`}
              >
                {tab.count}
              </span>
            </div>
          ))}
        </div>

        {/* Meetings */}
        <div className="flex-1 border-l pl-6 space-y-4">
          {meetings.map((item, idx) => (
            <div key={idx} className="flex items-center gap-6">
              <p className="text-sm font-semibold w-24 text-right">{item.time}</p>
              <p className="text-sm text-gray-500">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;