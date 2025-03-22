import React, { useState, useEffect } from 'react';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommentBox = () => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/user-comments');
                if (response.ok) {
                    const data = await response.json();
                    setComments(data);
                } else {
                    console.error('Failed to fetch comments:', response.status);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.trim()) {
            try {
                const response = await fetch('http://localhost:5000/api/user-comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: comment }),
                });

                if (response.ok) {
                    const newComment = await response.json();
                    setComments(prevComments => [newComment, ...prevComments]);
                    setComment('');
                } else {
                    console.error('Failed to add comment:', response.status);
                }
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    return (
        <div className="fixed bottom-20 left-0 right-0 px-4">
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-md mx-auto mb-4"
                    >
                        <div className="max-h-40 overflow-y-auto">
                            {comments.length === 0 ? (
                                <p className="text-center py-2 text-gray-500">No comments yet</p>
                            ) : (
                                <CommentList comments={comments} />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-center mb-2">
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black bg-opacity-30 text-white transition-all"
                >
                    {showComments ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>
            </div>

            <div className="max-w-md mx-auto mb-4">
                <form onSubmit={handleSubmit} className="flex items-center">
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="flex-1 px-3 py-1.5 rounded-full bg-white bg-opacity-90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                        type="submit"
                        className="ml-[-30px] p-1.5 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors z-10"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
};

const CommentList = ({ comments }) => {
    return (
        <div
            className="space-y-1 p-6 bg-neutral-800/60 rounded-lg "
        >
            {comments.map((comment) => (
                <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 flex justify-between items-start bg-transparent rounded-lg shadow-md border border-gray-300"
                >
                    <div>
                        <p className="text-white text-sm">{comment.message}</p>
                        <span className="text-[0.6rem] text-white ml-2 opacity-70">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default CommentBox;