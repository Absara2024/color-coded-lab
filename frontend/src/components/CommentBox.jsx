import React, { useState } from 'react';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommentBox = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        text: comment,
        timestamp: new Date().toLocaleString(),
      };
      setComments(prevComments => [newComment, ...prevComments]);
      setComment('');
    }
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 px-4">
      {/* Comment Input Section */}
      <div className="max-w-2xl mx-auto mb-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 px-4 py-2 rounded-full bg-white bg-opacity-90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      {/* Toggle Comments Button */}
      <div className="flex justify-center mb-2">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
        >
          {showComments ? (
            <>Hide Comments <ChevronDown size={20} /></>
          ) : (
            <>Show Comments <ChevronUp size={20} /></>
          )}
        </button>
      </div>

      {/* Comments List */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white bg-opacity-90 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No comments yet</p>
              ) : (
                <CommentList comments={comments} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CommentList = ({ comments }) => {
  return (
    <div className="divide-y divide-gray-200">
      {comments.map((comment) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 hover:bg-gray-50"
        >
          <div className="flex justify-between items-start">
            <p className="text-gray-800">{comment.text}</p>
            <span className="text-xs text-gray-500 ml-4">{comment.timestamp}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CommentBox;