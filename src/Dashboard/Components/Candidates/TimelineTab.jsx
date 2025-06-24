import React, { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, Phone, FileText, Edit2, Trash2, UserSearch, UserPen, Smile, BadgeCheck, Users } from "lucide-react";
import moment from "moment";

const iconMap = {
  1: <UserSearch size={20} />,
  2: <UserPen size={20} />,
  3: <Phone size={20} />,
  4: <FileText size={20} />,
  5: <Users size={20} />,
  6: <BadgeCheck size={20} />,
  7: <Smile size={20} />,
};

const TimelineTab = ({ applicationId }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!applicationId) return;

    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/job-applications/${applicationId}/logs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        const sortedLogs = (response.data.data.reverse() || []).sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setLogs(sortedLogs);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };

    fetchLogs();
  }, [applicationId]);

  return (
    <div className="divide-y divide-gray-200 bg-white">
      {logs.length === 0 ? (
        <p className="p-4 text-sm text-gray-500">No timeline activity yet.</p>
      ) : (
        logs.map((log, index) => (
          <div
            key={log.id || index}
            className="group flex items-center gap-4 px-4 py-4 min-h-[80px]"
          >
            <div className="text-gray-500">
              {iconMap?.[Number(log.to_stage)] || <MessageSquare size={20} />}
            </div>
            <img
              src={`https://i.pravatar.cc/40?img=${(index % 70) + 1}`}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium text-gray-800 truncate">
                Moved to {log.to_stage_label} stage by {log.changed_by}
              </div>
              <div className="text-xs text-gray-500">
                {log?.updated_at ? moment(log?.updated_at).fromNow() : "N/A"}
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <button><Edit2 size={16} /></button>
              <button><Trash2 size={16} /></button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TimelineTab;
