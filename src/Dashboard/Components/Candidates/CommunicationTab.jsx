import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAvatarUrl } from "../../../utils/avatarUtils.js";
import { ExternalLink, Copy, Check } from "lucide-react";

const CommunicationsTab = ({ applicationId }) => {
  const [communications, setCommunications] = useState([]);
  const [copiedUrls, setCopiedUrls] = useState({}); // Track copied URLs by their key

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

  // Function to copy URL to clipboard
  const copyToClipboard = (url, urlKey) => {
    navigator.clipboard.writeText(url).then(() => {
      // Set this URL as copied
      setCopiedUrls(prev => ({ ...prev, [urlKey]: true }));
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedUrls(prev => ({ ...prev, [urlKey]: false }));
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy URL:', err);
    });
  };

  // Function to format long URLs - break at common separators
  const formatUrlForDisplay = (url) => {
    if (!url) return url;
    
    // Break URL at slashes, dots, and hyphens for better wrapping
    return url
      .replace(/\//g, '/\u200B')  // Zero-width space after slashes
      .replace(/\./g, '.\u200B')  // Zero-width space after dots
      .replace(/\-/g, '-\u200B')  // Zero-width space after hyphens
      .replace(/\?/g, '?\u200B')  // Zero-width space after question marks
      .replace(/\=/g, '=\u200B')  // Zero-width space after equals
      .replace(/\&/g, '&\u200B'); // Zero-width space after ampersands
  };

  // Function to format message with clickable links
  const formatMessageWithLinks = (text, commId) => {
    if (!text) return text;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        const displayUrl = formatUrlForDisplay(part);
        const urlKey = `${commId}-${index}-${part.substring(0, 20)}`;
        
        return (
          <div key={index} className="inline-flex items-center gap-1  bg-blue-50 rounded px-1 py-0.5 my-0.5">
            <a
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline break-all flex items-center gap-1"
              title={part}
            >
              <ExternalLink size={12} className="flex-shrink-0" />
              <span className="break-all text-sm">{displayUrl}</span>
            </a>
            <button
              onClick={() => copyToClipboard(part, urlKey)}
              className="p-1 hover:bg-blue-100 rounded transition-colors"
              title="Copy link"
            >
              {copiedUrls[urlKey] ? (
                <Check size={12} className="text-green-600" />
              ) : (
                <Copy size={12} className="text-gray-500 hover:text-gray-700" />
              )}
            </button>
          </div>
        );
      }
      return <span key={index} className="break-words text-sm">{part}</span>;
    });
  };

  // Function to extract URLs from text
  const extractUrls = (text) => {
    if (!text) return [];
    const urlRegex = /https?:\/\/[^\s]+/g;
    return text.match(urlRegex) || [];
  };

  // Truncate URL for display in preview
  const truncateUrl = (url, maxLength = 60) => {
    if (url.length <= maxLength) return url;
    const start = url.substring(0, maxLength - 20);
    const end = url.substring(url.length - 20);
    return `${start}...${end}`;
  };

  if (communications.length === 0) {
    return <p className="text-center text-gray-500">No communications found.</p>;
  }

  return (
    <div className="space-y-4">
      {communications.map((comm) => {
        const firstName = comm.sender_name?.split(" ")[0] || "User";
        const lastName = comm.sender_name?.split(" ")[1] || "";
        const profileImage = comm.sender_profile_image;
        const urls = extractUrls(comm.message);

        return (
          <div
            key={comm.id}
            className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200"
          >
            <img
              src={getAvatarUrl(firstName, lastName, profileImage)}
              alt={comm.sender_name || "Sender"}
              className="rounded-full w-10 h-10 object-cover flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <p className="font-medium text-gray-800 truncate">{comm.sender_name}</p>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(comm.sent_at).toLocaleString()}
                </span>
              </div>

              {comm.subject && (
                <p className="text-sm font-semibold text-gray-700 mb-2 truncate">
                  {comm.subject}
                </p>
              )}

              <div className="text-sm text-gray-600">
                {/* Display URLs in preview if they exist */}
                {/* {urls.length > 0 && (
                  <div className="mb-3 p-2 bg-blue-50 rounded-md border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium mb-2">
                      {urls.length === 1 ? "Link included in message:" : "Links included in message:"}
                    </p>
                    
                  </div>
                )} */}

                {/* Main message content */}
                <div className="whitespace-pre-wrap text-sm break-words bg-gray-50 p-3 rounded-md">
                  {formatMessageWithLinks(comm.message, comm.id)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommunicationsTab;