import React, { useState } from "react";
import HeaderControls from "../../Components/TimeOff/HeaderControls";
import LeaveSection from "../../Components/TimeOff/LeaveSection";
import { formatLeaveMonth, getLeaveWeekDates, getLeaveMonthDates } from "../../../utils/leaveDateUtils";
import TimeOffStatusModal from "../../Components/TimeOff/TimeOffStatusModal";

export default function TimeOff() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week");
  const [weekMenuOpen, setWeekMenuOpen] = useState(false);
  const [selectedWeekLabel, setSelectedWeekLabel] = useState("Current Week");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [modalLeave, setModalLeave] = useState(null);


  const switchToWeekView = () => {
    setViewMode("week");
    setCurrentDate(new Date());
  };

  const switchToMonthView = () => {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    setViewMode("month");
    setCurrentDate(firstOfMonth);
  };

  const goToPrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
      newDate.setDate(1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
      newDate.setDate(1);
    }
    setCurrentDate(newDate);
  };

  const goToWeek = (offset) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + offset * 7);
    setCurrentDate(newDate);

    if (offset === 0) setSelectedWeekLabel("Current Week");
    else if (offset === -1) setSelectedWeekLabel("Last Week");
    else if (offset === 1) setSelectedWeekLabel("Next Week");
    else setSelectedWeekLabel("Week");
  };

  const weekDates = getLeaveWeekDates(currentDate);
  const monthDates = getLeaveMonthDates(currentDate);

  const days = (viewMode === "month" ? monthDates : weekDates).map((date) =>
    date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })
  );

  const leaves = [
    {
      empId: 1,
      name: "Milly",
      initials: "AN",
      role: "UI/UX Design",
      hours: "44 Hours",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      team: "Frontend",
      start: new Date(2025, 5, 25),
      end: new Date(2025, 6, 1),
      label: "Paid time off",
    },
    {
      empId: 2,
      name: "Joseph",
      initials: "",
      role: "Frontend Dev",
      hours: "24 Hours",
      avatar: "https://randomuser.me/api/portraits/men/81.jpg",
      team: "Frontend",
      start: new Date(2025, 5, 4),
      end: new Date(2025, 5, 6),
      label: "Unpaid Leave",
    },
    {
      empId: 3,
      name: "Vishal",
      initials: "",
      role: "Frontend Dev",
      hours: "24 Hours",
      avatar: "https://randomuser.me/api/portraits/men/81.jpg",
      team: "Backend",
      start: new Date(2025, 5, 7),
      end: new Date(2025, 5, 9),
      label: "Unpaid Leave",
    },
    {
      empId: 4,
      name: "Subham",
      initials: "",
      role: "Frontend Dev",
      hours: "24 Hours",
      avatar: "https://randomuser.me/api/portraits/men/14.jpg",
      team: "Backend",
      start: new Date(2025, 5, 13),
      end: new Date(2025, 5, 17),
      label: "Sick Leave",
    },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-md">
        <HeaderControls
          viewMode={viewMode}
          switchToWeekView={switchToWeekView}
          switchToMonthView={switchToMonthView}
          goToPrev={goToPrev}
          goToNext={goToNext}
          formatMonth={formatLeaveMonth}
          currentDate={currentDate}
          weekMenuOpen={weekMenuOpen}
          setWeekMenuOpen={setWeekMenuOpen}
          selectedWeekLabel={selectedWeekLabel}
          goToWeek={goToWeek}
          statusMenuOpen={statusMenuOpen}
          setStatusMenuOpen={setStatusMenuOpen}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        <div className="px-4 py-2">
          <LeaveSection
            days={days}
            viewMode={viewMode}
            weekDates={weekDates}
            monthDates={monthDates}
            leaves={leaves}
            onLeaveClick={setModalLeave}
          />
        </div>
      </div>
      {modalLeave && (
        <TimeOffStatusModal
          leave={modalLeave}
          onClose={() => setModalLeave(null)}
        />
      )}
    </div>
  );
}
