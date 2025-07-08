import React, { useEffect, useState } from "react";
import { Calendar, Infinity as InfinityIcon } from "lucide-react";
import TimeOffRequestModal from "../../Pages/Attendence/TimeOffRequestModal";
import axios from "axios";
import ModalWrapper from "../ModalWrapper";

const TimeOffBalancesCard = () => {
  const [showModal, setShowModal] = useState(false);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveBalances = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/time-off-requests/leave-balance`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.success) {
          const order = ["Paid Time Off", "Sick Leave", "Unpaid Leave"];
          const sorted = response.data.data.sort((a, b) => {
            const aIndex = order.indexOf(a.type);
            const bIndex = order.indexOf(b.type);
            return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
          });

          setLeaveBalances(sorted);
        }
      } catch (err) {
        console.error("Failed to fetch leave balances", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveBalances();
  }, []);

  return (
    <>
      <div className="bg-white rounded-2xl shadow overflow-hidden w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#007a6e] rounded-full flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-black">Your time-off Balances</h2>
          </div>
          <button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className={`px-5 py-1.5 rounded-full text-sm font-medium ${loading
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-[#007A6E] hover:bg-[#006a60] text-white"
              }`}
          >
            Request Time Off
          </button>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-300 p-4 flex flex-col justify-center h-24 animate-pulse"
              >
                <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            ))
            : leaveBalances.map((leave) => {
              const isSick = leave.type.toLowerCase().includes("sick");
              const isUnpaid = leave.type.toLowerCase().includes("unpaid");

              const displayValue =
                isUnpaid && leave.remaining_days === 0
                  ? "∞"
                  : leave.remaining_days.toString().padStart(2, "0");

              const unit = isUnpaid
                ? "Unlimited leave"
                : "Days available";


              const containerClass = isSick
                ? "bg-[#007A6E] text-white"
                : "border-2 border-[#007A6E] text-[#1A1A1A]";

              return (
                <div
                  key={leave.id}
                  className={`rounded-xl p-4 flex flex-col justify-center h-24 ${containerClass}`}
                >
                  <p className="text-sm font-medium mb-2">{leave.type}</p>

                  <div className="flex items-baseline gap-2">
                    {displayValue === "∞" ? (
                      <InfinityIcon className="w-8 h-6 font-semibold" />
                    ) : (
                      <span className="text-3xl font-extrabold leading-none">
                        {displayValue}
                      </span>
                    )}
                    <span className="text-sm leading-tight">{unit}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {showModal && (
        <ModalWrapper>
          <TimeOffRequestModal onClose={() => setShowModal(false)} />
        </ModalWrapper>
      )}

    </>
  );
};

export default TimeOffBalancesCard;
