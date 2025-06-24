import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import ProfileImage from "../ProfileImage";

const CommentTab = ({ applicationId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const token = localStorage.getItem("access_token");

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
    if (!newComment.trim()) return;
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
        fetchComments(); // Refresh comments
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
      setVisibleCount(3); // Reset visible count when ID changes
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

      {/* Input box */}
      <div className="flex items-start gap-2 mb-6">
        <ProfileImage
          src={"https://randomuser.me/api/portraits/men/10.jpg"}
          alt="User"
          height={10}
          width={10}
          iconSize={28}
        />
        <div className="flex-1 text-sm">
          <textarea
            rows={3}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-md resize-none"
          />
          <div className="text-right mt-1">
            <button
              onClick={handlePost}
              disabled={loading}
              className="bg-teal-700 text-white px-4 py-[6px] rounded text-sm"
            >
              {loading ? "Posting..." : "Add a comment"}
            </button>
          </div>
        </div>
      </div>

      {/* Comment list */}
      {visibleComments.map((comment) => (
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
      ))}

      {hasMoreComments && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            className="text-sm bg-teal-700 text-white py-[6px] px-4 rounded"
          >
            Load more comments
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentTab;
