import React, { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import axios from "axios";
import { getAvatarUrl } from "../../../utils/avatarUtils.js";

const ReviewTab = ({ applicationId }) => {
  const [reviews, setReviews] = useState([]);
  const [expandedReviewIdx, setExpandedReviewIdx] = useState(null); // track expanded review index
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Get current user ID from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUserId(parsedUser.id);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!applicationId) return;

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/job-applications/${applicationId}/reviews`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setReviews(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchReviews();
  }, [applicationId]);

  const openModal = (idx) => {
    setExpandedReviewIdx(idx);
  };

  const closeModal = () => {
    setExpandedReviewIdx(null);
  };

  const FEEDBACK_PREVIEW_LIMIT = 100; // Characters threshold for "Read more"

  return (
    <div>
      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500 col-span-full text-center">
            No reviews found.
          </p>
        ) : (
          reviews.map((review, idx) => {
            const feedback = review.feedback?.trim() || "No feedback";
            const isLongFeedback = feedback.length > FEEDBACK_PREVIEW_LIMIT;
            const previewText = isLongFeedback
              ? feedback.substring(0, FEEDBACK_PREVIEW_LIMIT) + "..."
              : feedback;

            // Check if this review was made by the current user
            const isCurrentUserReview = currentUserId && review.reviewed_by_id === currentUserId;

            return (
              <div
                key={idx}
                className="bg-white border border-red-200 rounded-2xl px-4 py-4 shadow-sm text-center relative"
              >
                {/* "You" badge for current user's review */}
                {isCurrentUserReview && (
                  <div className="absolute top-2 right-2 bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
                    You
                  </div>
                )}

                <img
                  src={getAvatarUrl(
                    review.reviewer_name?.split(" ")[0] || "User",
                    review.reviewer_name?.split(" ")[1] || "",
                    review.reviewer_profile_pic
                  )}
                  alt={review.reviewer_name || "Reviewer"}
                  className="mx-auto h-16 w-16 rounded-full object-cover"
                />

                <div className="mt-2">
                  <h2 className="text-md font-medium">
                    {review.reviewer_name || "User"}
                    {/* {isCurrentUserReview && (
                      <span className="ml-1 text-xs text-teal-600 font-normal">(You)</span>
                    )} */}
                  </h2>
                  {review.reviewer_role && (
                    <span className="text-xs text-gray-500 capitalize">
                      {review.reviewer_role === 1 && "Employer"}
                      {review.reviewer_role === 5 && "Employee"}
                      {review.reviewer_role === 6 && "Candidate"}
                    </span>
                  )}
                </div>

                <div className="flex justify-center mt-1 text-orange-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      fill={i < review.rating ? "currentColor" : "none"}
                      stroke="currentColor"
                      size={16}
                    />
                  ))}
                </div>

                <div className="mt-2 px-2 py-2 rounded-lg bg-gray-100 text-xs font-medium text-gray-600 max-h-10 overflow-hidden break-words whitespace-normal">
                  {previewText}
                </div>

                {isLongFeedback && (
                  <button
                    onClick={() => openModal(idx)}
                    className="text-red-600 font-semibold cursor-pointer text-xs mt-1"
                  >
                    Read more
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal for expanded feedback */}
      {expandedReviewIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center bg-teal-700 text-white px-4 py-2">
              <h3 className="text-sm font-semibold">
                Feedback by {reviews[expandedReviewIdx].reviewer_name}
                {currentUserId && reviews[expandedReviewIdx].reviewed_by_id === currentUserId && (
                  <span className="ml-2 text-xs font-normal">(You)</span>
                )}
              </h3>
              <button onClick={closeModal} className="hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto text-sm text-gray-800 break-words whitespace-normal">
              {reviews[expandedReviewIdx].feedback || "No feedback available."}
            </div>
            <div className="p-4 text-center border-t">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Show less
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewTab;