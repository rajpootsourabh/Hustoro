import React, { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, Phone, FileText, Edit2, Trash2, UserSearch, UserPen, Smile, BadgeCheck, Users, ChevronDown, ChevronUp } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5); // Show first 5 items
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!applicationId) return;

    const fetchLogs = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [applicationId]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  const visibleLogs = showAll ? logs : logs.slice(0, visibleCount);
  const hasMoreLogs = visibleCount < logs.length && !showAll;
  const canShowAll = logs.length > 5;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-sm text-gray-500">No stage history yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Fixed height container with scrollbar */}
      <div
        className={`divide-y divide-gray-200 bg-white ${showAll ? '' : 'max-h-[300px]' // Fixed height when not showing all
          } overflow-y-auto pr-2 custom-scrollbar`}
      >
        {visibleLogs.map((log, index) => (
          <div
            key={log.id || index}
            className="group flex items-center gap-4 px-4 py-4 min-h-[80px] hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="text-gray-500 flex-shrink-0">
              {getStageIcon(log.to_stage?.type, log.to_stage_label)}
            </div>
            <img
              src={getAvatarUrl(
                log.changed_by?.split(" ")[0] || "User",
                log.changed_by?.split(" ")[1] || "",
                log.changed_by_profile_image
              )}
              alt={log.changed_by || "User"}
              className="h-10 w-10 rounded-full object-cover flex-shrink-0"
            />

            <div className="flex-1 overflow-hidden min-w-0">
              <div className="text-sm font-medium text-gray-800 break-words">
                {log.from_stage_label ?
                  `Moved from ${log.from_stage_label} to ${log.to_stage_label}` :
                  `Moved to ${log.to_stage_label} stage`
                } by {log.changed_by}
              </div>
              {log.note && (
                <div className="text-sm text-gray-600 mt-1 break-words">
                  <span className="font-medium">Note:</span> {log.note}
                </div>
              )}
              {/* {log.is_hire_action && (
                <div className="text-xs text-green-600 font-medium mt-1 flex items-center">
                  <BadgeCheck size={14} className="mr-1" />
                  Employee record created
                </div>
              )} */}
              <div className="text-xs text-gray-500 mt-1">
                {log?.changed_at ? moment(log?.changed_at).fromNow() :
                  log?.created_at ? moment(log?.created_at).fromNow() : "N/A"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center border-t pt-3">
        <div className="text-sm text-gray-500">
          Showing {Math.min(visibleCount, logs.length)} of {logs.length} entries
        </div>

        <div className="flex gap-2">
          {/* {canShowAll && (
            <button
              onClick={handleShowAll}
              className="text-sm text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1 px-3 py-1 rounded hover:bg-teal-50 transition-colors"
            >
              {showAll ? (
                <>
                  <ChevronUp size={16} />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Show All ({logs.length})
                </>
              )}
            </button>
          )} */}

          {hasMoreLogs && !showAll && (
            <button
              onClick={handleLoadMore}
              className="text-sm bg-teal-700 text-white py-2 px-4 rounded hover:bg-teal-800 transition-colors"
            >
              Load More
            </button>
          )}
        </div>
      </div>

      {/* Add this to your global CSS or component-specific styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
};

export default TimelineTab;