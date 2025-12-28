import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import ProfileImage from "../ProfileImage";
import { useRoleEnabled } from '../../../hooks/useRoleEnabled'; // Import hook
import { getAvatarUrl } from "../../../utils/avatarUtils.js";

const CommentTab = ({ applicationId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const token = localStorage.getItem("access_token");
  
  // Check if user has role 5 (Employee)
  const { isEnabled: isEmployeeEnabled } = useRoleEnabled(5);
  
  // Only employees (role 5) can post comments
  const canPostComments = isEmployeeEnabled;

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/job-applications/${applicationId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status) {
        setComments(response.data.data.reverse()); // Newest first
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handlePost = async () => {
    if (!newComment.trim() || !canPostComments) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/job-applications/${applicationId}/comments`,
        {
          candidateApplicationId: applicationId,
          comment: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (res.data.status) {
        setNewComment("");
        fetchComments();
        setVisibleCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId) {
      fetchComments();
      setVisibleCount(3);
    }
  }, [applicationId]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const visibleComments = comments.slice(0, visibleCount);
  const hasMoreComments = visibleCount < comments.length;

  return (
    <div className="w-full mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">{comments.length} Comments</h2>

      {/* Input box - Only show for employees */}
      {canPostComments ? (
        <div className="flex items-start gap-2 mb-6">
          <img
            src={getAvatarUrl("Current", "User", "")}
            alt="User"
            className="rounded-full h-10 w-10 object-cover"
          />
          <div className="flex-1 text-sm">
            <textarea
              rows={3}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              disabled={loading}
            />
            <div className="text-right mt-1">
              <button
                onClick={handlePost}
                disabled={loading || !newComment.trim()}
                className="px-4 py-[6px] rounded text-sm bg-teal-700 text-white hover:bg-teal-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {loading ? "Posting..." : "Add a comment"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3 bg-gray-100 rounded-md text-center text-gray-600">
          <p className="text-sm">
            Only employees who are assigned to a candidate’s application can add comments.
          </p>
        </div>
      )}

      {/* Comment list - Visible to all users */}
      {visibleComments.length > 0 ? (
        visibleComments.map((comment) => (
          <div key={comment.id} className="mb-4">
            <div className="flex items-start gap-3">
              <ProfileImage
                src={comment.profile_image}
                alt={`User ${comment.commented_by_name}`}
                size={10}
              />
              <div>
                <p className="text-sm">
                  <span className="font-semibold text-teal-700">
                    {comment.commented_by_name}
                  </span>{" "}
                  <span className="text-gray-600">added a comment</span>
                </p>
                <p className="text-sm text-gray-800 mt-1">{comment.comment}</p>
                <div className="flex gap-4 text-gray-500 mt-1">
                  <span className="text-xs">
                    {moment(comment.created_at).fromNow()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>No comments yet.</p>
        </div>
      )}

      {hasMoreComments && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            className="text-sm bg-teal-700 text-white py-[6px] px-4 rounded hover:bg-teal-800"
          >
            Load more comments
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentTab;