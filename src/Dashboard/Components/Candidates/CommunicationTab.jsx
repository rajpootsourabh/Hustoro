import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAvatarUrl } from "../../../utils/avatarUtils.js";

const CommunicationsTab = ({ applicationId }) => {
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

        setCommunications(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch communications:", error);
      }
    };

    fetchCommunications();
  }, [applicationId]);

  if (communications.length === 0) {
    return <p className="text-center text-gray-500">No communications found.</p>;
  }

  return (
    <div className="space-y-4">
      {communications.map((comm) => {
        const firstName = comm.sender_name?.split(" ")[0] || "User";
        const lastName = comm.sender_name?.split(" ")[1] || "";
        const profileImage = comm.sender_profile_image;

        return (
          <div
            key={comm.id}
            className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border"
          >
            <img
              src={getAvatarUrl(firstName, lastName, profileImage)}
              alt={comm.sender_name || "Sender"}
              className="rounded-full w-10 h-10 object-cover"
            />

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-800">{comm.sender_name}</p>
                <span className="text-xs text-gray-500">{new Date(comm.sent_at).toLocaleString()}</span>
              </div>

              {comm.subject && <p className="text-sm font-semibold text-gray-700">{comm.subject}</p>}

              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{comm.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommunicationsTab;
