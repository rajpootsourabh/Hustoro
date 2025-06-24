import React, { useEffect, useState } from "react";
import { Mail, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import moment from "moment";

const iconMap = {
  email: Mail,
  sms: MessageSquare,
};

const CommunicationTab = ({ applicationId }) => {
  const [communications, setCommunications] = useState([]);

  useEffect(() => {
    if (!applicationId) return;

    const fetchCommunications = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/job-applications/${applicationId}/communications`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setCommunications(response.data.data.reverse() || []);
      } catch (error) {
        console.error("Failed to fetch communications:", error);
      }
    };

    fetchCommunications();
  }, [applicationId]);

  return (
    <div className="bg-white space-y-2">
      {communications.length === 0 ? (
        <p className="text-sm text-gray-500 p-4">No communications found.</p>
      ) : (
        communications.map((com) => {
          const Icon = iconMap[com.type] || Mail;
          return (
            <div
              key={com.id}
              className="p-4 hover:bg-gray-50 hover:rounded-md transition flex flex-col gap-1"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900 font-medium">
                    {com.subject || "No Subject"}
                  </span>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {com.sent_at ? moment(com.sent_at).fromNow()
                    : "N/A"}
                </span>
              </div>
              <div className="text-gray-700 text-sm truncate">{com.message}</div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CommunicationTab;
