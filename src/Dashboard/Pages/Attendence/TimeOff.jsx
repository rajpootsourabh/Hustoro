import React, { useEffect, useState } from "react";
import HeaderControls from "../../Components/TimeOff/HeaderControls";
import LeaveSection from "../../Components/TimeOff/LeaveSection";
import {
  formatLeaveMonth,
  getLeaveWeekDates,
  getLeaveMonthDates,
  normalizeDate
} from "../../../utils/leaveDateUtils";
import axios from "axios";
import TimeOffApprovalStatusModal from "../../Components/TimeOff/TimeOffApprovalStatusModal";
import TimeOffRequestReviewModal from "./TimeOffRequestReviewModal";

export default function TimeOff() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week");
  const [weekMenuOpen, setWeekMenuOpen] = useState(false);
  const [selectedWeekLabel, setSelectedWeekLabel] = useState("Current Week");
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [modalLeave, setModalLeave] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLeaveClick = (leave) => {
    setModalLeave(leave);
    setModalType(leave.status === "pending" ? "review" : "status");
  };

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
    if (viewMode === "week") newDate.setDate(newDate.getDate() - 7);
    else {
      newDate.setMonth(newDate.getMonth() - 1);
      newDate.setDate(1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") newDate.setDate(newDate.getDate() + 7);
    else {
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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);

        let startDate, endDate;

        if (viewMode === "week") {
          const today = new Date(currentDate);
          const day = today.getDay();
          const monday = new Date(today);
          monday.setDate(today.getDate() - ((day + 6) % 7));
          const sunday = new Date(monday);
          sunday.setDate(monday.getDate() + 6);

          startDate = monday.toLocaleDateString("en-CA");
          endDate = sunday.toLocaleDateString("en-CA");
        } else {
          const today = new Date(currentDate);
          const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
          const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

          startDate = firstDay.toLocaleDateString("en-CA");
          endDate = lastDay.toLocaleDateString("en-CA");
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/time-off-requests/manager`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            params: {
              ...(selectedType !== "All" && { type: selectedType }),
              start_date: startDate,
              end_date: endDate,
            },
          }
        );

        if (response.data.success) {
          const formatted = response.data.data.map((emp) => ({
            empId: emp.empId,
            name: emp.name,
            role: emp.role,
            avatar: emp.avatar,
            leaves: emp.leaves.map((leave) => ({
              id: leave.id,
              start: normalizeDate(leave.start),
              end: normalizeDate(leave.end),
              label: leave.label,
              requestedOn: leave.created_at,
              status: leave.status,
            })),
          }));
          setEmployees(formatted);
        } else {
          console.error("API returned success: false");
        }
      } catch (err) {
        console.error("Error fetching time-off data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [viewMode, currentDate, selectedType]);



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
          typeMenuOpen={typeMenuOpen}
          setTypeMenuOpen={setTypeMenuOpen}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />

        <div className="px-4 py-2">
          <LeaveSection
            days={days}
            viewMode={viewMode}
            weekDates={weekDates}
            monthDates={monthDates}
            employees={employees}
            onLeaveClick={handleLeaveClick}
            loading={loading}
          />
        </div>
      </div>

      {modalLeave && modalType === "review" && (
        <TimeOffRequestReviewModal
          leave={modalLeave}
          onClose={() => {
            setModalLeave(null);
            setModalType(null);
          }}
        />
      )}

      {modalLeave && modalType === "status" && (
        <TimeOffApprovalStatusModal
          leave={modalLeave}
          onClose={() => {
            setModalLeave(null);
            setModalType(null);
          }}
        />
      )}
    </div>
  );
}
