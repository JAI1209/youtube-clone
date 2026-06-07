import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axios from '../api/axios';

const VideoPlayer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchVideo = useCallback(async () => {
    try {
      const { data } = await axios.get(`/videos/${id}`);
      setVideo(data);
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await axios.get(`/comments/${id}`);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [fetchVideo, fetchComments]);

  const handleLike = async () => {
    if (!user) return alert('Please sign in to like videos');
    try {
      const { data } = await axios.put(`/videos/${id}/like`);
      setVideo(data);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) return alert('Please sign in to dislike videos');
    try {
      const { data } = await axios.put(`/videos/${id}/dislike`);
      setVideo(data);
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };

  const handleAddComment = async () => {
    if (!user) return alert('Please sign in to comment');
    if (!newComment.trim()) return;
    try {
      const { data } = await axios.post(`/comments/${id}`, { text: newComment });
      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const { data } = await axios.put(`/comments/${commentId}`, { text: editText });
      setComments(comments.map(c => c._id === commentId ? data : c));
      setEditingComment(null);
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const isLiked = user && video?.likes?.includes(user._id);
  const isDisliked = user && video?.dislikes?.includes(user._id);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white text-xl">
      Loading...
    </div>
  );

  if (!video) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white text-xl">
      Video not found
    </div>
  );

  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} onSearch={() => {}} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`mt-14 p-6 transition-all duration-200 ${sidebarOpen ? 'ml-60' : 'ml-[72px]'}`}>
        <div className="max-w-4xl mx-auto">

          <video src={video.videoUrl} controls className="w-full rounded-xl bg-black max-h-[500px]" />

          <h1 className="text-xl font-bold text-white mt-4 mb-2">{video.title}</h1>

          <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
            <div>
              <Link to={`/channel/${video.channelId?._id}`} className="text-white font-semibold hover:text-gray-300">
                {video.channelId?.channelName}
              </Link>
              <p className="text-gray-400 text-sm">{video.views} views</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${isLiked ? 'bg-[#3ea6ff] text-black' : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'}`}
              >
                👍 {video.likes?.length || 0}
              </button>
              <button
                onClick={handleDislike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${isDisliked ? 'bg-[#3ea6ff] text-black' : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'}`}
              >
                👎 {video.dislikes?.length || 0}
              </button>
            </div>
          </div>

          <div className="bg-[#212121] p-4 rounded-xl mb-6 text-gray-400 text-sm">
            {video.description}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{comments.length} Comments</h3>

            {user ? (
              <div className="flex gap-3 mb-6">
                <img
                  src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt="avatar"
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    className="flex-1 px-4 py-2 rounded-lg border border-[#303030] bg-[#121212] text-white text-sm outline-none focus:border-[#3ea6ff]"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 rounded-lg bg-[#3ea6ff] text-black font-bold text-sm hover:bg-blue-400"
                  >
                    Comment
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 mb-6">
                <Link to="/login" className="text-[#3ea6ff] hover:underline">Sign in</Link> to comment
              </p>
            )}

            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3 mb-5">
                <img
                  src={comment.userId?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt="avatar"
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white text-sm font-semibold">{comment.userId?.username}</span>
                    <span className="text-gray-400 text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>

                  {editingComment === comment._id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-[#303030] bg-[#121212] text-white text-sm outline-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleEditComment(comment._id)} className="px-3 py-1 rounded-lg bg-[#3ea6ff] text-black text-xs font-bold">Save</button>
                        <button onClick={() => setEditingComment(null)} className="px-3 py-1 rounded-lg bg-[#272727] text-white text-xs">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white text-sm leading-relaxed">{comment.text}</p>
                  )}

                  {user && user._id === comment.userId?._id && (
                    <div className="flex gap-3 mt-1">
                      <button
                        onClick={() => { setEditingComment(comment._id); setEditText(comment.text); }}
                        className="text-[#3ea6ff] text-xs hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-400 text-xs hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPlayer;