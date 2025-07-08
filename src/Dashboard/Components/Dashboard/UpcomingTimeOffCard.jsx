import React, { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import axios from "axios";
import { formatFullDate } from "../../../utils/leaveDateUtils";

const UpcomingTimeOffCard = () => {
  const [timeOffs, setTimeOffs] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTimeOffs = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/time-off-requests/upcoming`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data?.success) {
          setTimeOffs(res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching time-offs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeOffs();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-6 w-full max-w-sm mx-auto">
      <h2 className="text-lg font-semibold mb-2 px-2">Upcoming Time-off</h2>
      <hr className="-mx-6 border-t border-gray-200 my-2" />

      <div className="space-y-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`flex gap-3 animate-pulse ${i !== 2 ? "pb-4 border-b border-gray-200" : ""
                }`}
            >
              <div className="w-12 h-12 rounded-lg bg-gray-200" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-36 bg-gray-100 rounded" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
            </div>
          ))
          : timeOffs.length > 0
            ? timeOffs.map((leave, i) => (
              <div
                key={leave.id}
                className={`flex items-center gap-3 ${i !== timeOffs.length - 1 ? "pb-4 border-b border-gray-200" : ""
                  }`}
              >
                {/* Calendar icon container */}
                <div className="w-12 h-12 rounded-lg bg-[#E5F8F3] flex items-center justify-center">
                  <CalendarDays className="text-[#007A6E] w-5 h-5" />
                </div>

                {/* Leave info */}
                <div className="flex-1 flex flex-col justify-center">
                  <p className="font-semibold text-sm text-black">{leave.title}</p>
                  <p className="text-sm text-[#1A1A1A]">{formatFullDate(leave.date)}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">
                      {parseInt(leave.days)} {parseInt(leave.days) === 1 ? "day" : "days"}
                    </span>
                  </div>
                </div>
              </div>
            ))
            : (
              <p className="text-sm text-gray-500 text-center">No upcoming time-off</p>
            )}
      </div>
    </div>
  );
};

export default UpcomingTimeOffCard;
