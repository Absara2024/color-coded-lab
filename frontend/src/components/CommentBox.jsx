import React, { useState, useEffect } from "react";
import { Send, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const USE_MOCK_API = true; 

const mockFetchComments = async (page = 1) => {
  const mockComments = Array.from({ length: 5 }, (_, i) => ({
    _id: `${page}-${i}`,
    text: `show comment ${i + 1} from page ${page}`,
    user: `User${i + 1}`,
    createdAt: new Date().toISOString(),
    replies: [],
  }));

  return {
    comments: showComments,
    pagination: { totalPages: 3 },
  };
};

const showPostComment = async ({ text, user }) => {
  return {
    _id: Date.now().toString(),
    text,
    user,
    createdAt: new Date().toISOString(),
    replies: [],
  };
};

const CommentBox = () => {
  const [comment, setComment] = useState("");
  const [user, setUser] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchComments = async (pageNumber = 1) => {
    try {
      const data = USE_MOCK_API
        ? await mockFetchComments(pageNumber)
        : await fetch(
            `http://localhost:5005/api/user-comments?page=${pageNumber}&limit=5`
          ).then((res) => res.json());

      if (data?.comments?.length > 0) {
        setComments((prev) => [...prev, ...data.comments]);
        setHasMore(pageNumber < data.pagination.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments(page);
    }
  }, [showComments, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.trim() || !comment.trim()) return;

    try {
      const newComment = USE_MOCK_API
        ? await showPostComment({ user, text: comment })
        : await fetch("http://localhost:5005/api/user-comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, text: comment }),
          }).then((res) => res.json());


      newComment.createdAt = newComment.createdAt || new Date().toISOString();

      setComments((prev) => [newComment, ...prev]);
      setComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleLoadMore = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-50">
      <div className="flex justify-center mb-2">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black bg-opacity-30 text-white"
        >
          {showComments ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 rounded-xl shadow-xl max-h-[300px] overflow-y-auto border border-gray-300"
          >
            <div className="p-4 space-y-2">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500">No comments yet</p>
              ) : (
                <CommentList comments={comments} />
              )}
              {hasMore && (
                <div className="text-center mt-2">
                  <button
                    onClick={handleLoadMore}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        className="mt-2 bg-white p-3 rounded-xl shadow-md flex flex-col gap-2 border border-gray-300"
      >
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Your name"
          className="px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          required
        />
        <div className="flex items-center">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
          <button
            type="submit"
            className="ml-[-30px] p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 z-10"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

const CommentList = ({ comments }) => (
  <div className="space-y-2">
    {comments.map((comment) => (
      <motion.div
        key={comment._id || comment.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-2 bg-gray-100 rounded-md border border-gray-200"
      >
        <p className="text-gray-800 text-sm">{comment.text}</p>
        <span className="text-xs text-gray-500">
          — {comment.user} at{" "}
          {comment.createdAt
            ? new Date(comment.createdAt).toLocaleString()
            : "unknown"}
        </span>
      </motion.div>
    ))}
  </div>
);

export default CommentBox;
