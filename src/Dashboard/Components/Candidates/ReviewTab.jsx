import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";
import { GoPerson } from "react-icons/go"; // Import icon
import ProfileImage from "../ProfileImage";


const ReviewTab = ({ applicationId }) => {
  const [reviews, setReviews] = useState([]);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500 col-span-full text-center">
          No reviews found.
        </p>
      ) : (
        reviews.map((review, idx) => (
          <div
            key={idx}
            className="bg-white border border-red-200 rounded-2xl px-4 py-4 shadow-sm text-center"
          >
            <ProfileImage
              src={`http://localhost:8000/storage/${review.reviewer_profile_pic}`}
              alt={review.reviewed_by_name || review.reviewer_name || "Reviewer"}
              height={14}
              width={14}
              iconSize={28}
              className={"mx-auto"}
            />
            <h2 className="text-md mt-2">{review.reviewer_name || "User"}</h2>
            <p className="text-gray-500 text-xs">
              {review.reviewer_address}, {review.reviewer_country}
            </p>
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

            <div className="mt-2 px-2 py-2 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">
              {review.feedback?.trim() || "No feedback"}
              {review.feedback?.trim() && (
                <span className="text-red-600 font-semibold cursor-pointer text-xs">
                  {" "}
                  read more
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewTab;
