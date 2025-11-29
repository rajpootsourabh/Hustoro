import React, { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, Phone, FileText, Edit2, Trash2, UserSearch, UserPen, Smile, BadgeCheck, Users } from "lucide-react";
import moment from "moment";
import { getAvatarUrl } from "../../../utils/avatarUtils.js"; 

// Updated icon mapping for dynamic stages (fallback icons)
const getStageIcon = (stageType, stageName) => {
  const lowerStageName = stageName?.toLowerCase() || '';
  
  if (lowerStageName.includes('phone') || lowerStageName.includes('screen')) {
    return <Phone size={20} />;
  }
  if (lowerStageName.includes('interview')) {
    return <Users size={20} />;
  }
  if (lowerStageName.includes('assessment') || lowerStageName.includes('test')) {
    return <FileText size={20} />;
  }
  if (lowerStageName.includes('offer')) {
    return <BadgeCheck size={20} />;
  }
  if (lowerStageName.includes('hire') || lowerStageName.includes('onboard')) {
    return <Smile size={20} />;
  }
  if (stageType === 'hiring') {
    return <UserSearch size={20} />;
  }
  if (stageType === 'onboarding') {
    return <UserPen size={20} />;
  }
  
  return <MessageSquare size={20} />;
};

const TimelineTab = ({ applicationId }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!applicationId) return;

    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/job-applications/${applicationId}/stage-history`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        const sortedLogs = (response.data.data || []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setLogs(sortedLogs);
      } catch (error) {
        console.error("Failed to fetch stage history:", error);
      }
    };

    fetchLogs();
  }, [applicationId]);

  return (
    <div className="divide-y divide-gray-200 bg-white">
      {logs.length === 0 ? (
        <p className="p-4 text-sm text-gray-500">No stage history yet.</p>
      ) : (
        logs.map((log, index) => (
          <div
            key={log.id || index}
            className="group flex items-center gap-4 px-4 py-4 min-h-[80px]"
          >
            <div className="text-gray-500">
              {getStageIcon(log.to_stage?.type, log.to_stage_label)}
            </div>
            <img
              src={getAvatarUrl(
                log.changed_by?.split(" ")[0] || "User", 
                log.changed_by?.split(" ")[1] || "",    
                log.changed_by_profile_image          
              )}
              alt={log.changed_by || "User"}
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium text-gray-800 truncate">
                {log.from_stage_label ? 
                  `Moved from ${log.from_stage_label} to ${log.to_stage_label}` :
                  `Moved to ${log.to_stage_label} stage`
                } by {log.changed_by}
              </div>
              {log.note && (
                <div className="text-sm text-gray-600 mt-1">
                  Note: {log.note}
                </div>
              )}
              {log.is_hire_action && (
                <div className="text-xs text-green-600 font-medium mt-1">
                  ✓ Employee record created
                </div>
              )}
              <div className="text-xs text-gray-500">
                {log?.changed_at ? moment(log?.changed_at).fromNow() : 
                 log?.created_at ? moment(log?.created_at).fromNow() : "N/A"}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TimelineTab;