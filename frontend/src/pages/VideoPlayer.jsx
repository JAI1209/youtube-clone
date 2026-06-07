import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axios from '../api/axios';

const FALLBACK_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

const VideoPlayer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo]                   = useState(null);
  const [comments, setComments]             = useState([]);
  const [newComment, setNewComment]         = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText]             = useState('');
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [loading, setLoading]               = useState(true);

  const fetchVideo = useCallback(async () => {
    try { const { data } = await axios.get(`/videos/${id}`); setVideo(data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try { const { data } = await axios.get(`/comments/${id}`); setComments(data); }
    catch (e) { console.error(e); }
  }, [id]);

  useEffect(() => { fetchVideo(); fetchComments(); }, [fetchVideo, fetchComments]);

  const handleLike = async () => {
    if (!user) return alert('Please sign in to like videos');
    try { const { data } = await axios.put(`/videos/${id}/like`); setVideo(data); }
    catch (e) { console.error(e); }
  };

  const handleDislike = async () => {
    if (!user) return alert('Please sign in to dislike videos');
    try { const { data } = await axios.put(`/videos/${id}/dislike`); setVideo(data); }
    catch (e) { console.error(e); }
  };

  const handleAddComment = async () => {
    if (!user) return alert('Please sign in to comment');
    if (!newComment.trim()) return;
    try {
      const { data } = await axios.post(`/comments/${id}`, { text: newComment });
      setComments([data, ...comments]);
      setNewComment('');
    } catch (e) { console.error(e); }
  };

  const handleEditComment = async (commentId) => {
    try {
      const { data } = await axios.put(`/comments/${commentId}`, { text: editText });
      setComments(comments.map(c => c._id === commentId ? data : c));
      setEditingComment(null);
    } catch (e) { console.error(e); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (e) { console.error(e); }
  };

  const isLiked    = user && video?.likes?.includes(user._id);
  const isDisliked = user && video?.dislikes?.includes(user._id);

  if (loading) return <div className="yt-empty" style={{ minHeight: '100vh', background: '#0f0f0f' }}>Loading...</div>;
  if (!video)  return <div className="yt-empty" style={{ minHeight: '100vh', background: '#0f0f0f' }}>Video not found</div>;

  return (
    <div className="yt-app">
      <Header onMenuClick={() => setSidebarOpen((v) => !v)} onSearch={() => {}} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`yt-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="yt-player-wrap">
          <div className="yt-player-inner yt-player">

            {/* Video */}
            <video src={video.videoUrl} controls />

            {/* Title */}
            <h1 className="yt-player__title">{video.title}</h1>

            {/* Channel + Like/Dislike */}
            <div className="yt-player__meta">
              <div>
                <Link to={`/channel/${video.channelId?._id}`} className="yt-player__channel-name">
                  {video.channelId?.channelName}
                </Link>
                <div className="yt-player__views">{(video.views || 0).toLocaleString()} views</div>
              </div>
              <div className="yt-action-btns">
                <button className={`yt-action-btn ${isLiked ? 'active' : 'default'}`} onClick={handleLike}>
                  👍 {video.likes?.length || 0}
                </button>
                <button className={`yt-action-btn ${isDisliked ? 'active' : 'default'}`} onClick={handleDislike}>
                  👎 {video.dislikes?.length || 0}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="yt-description">{video.description}</div>

            {/* Comments */}
            <h3 className="yt-comments-title">{comments.length} Comments</h3>

            {user ? (
              <div className="yt-comment-input-row">
                <img src={user.avatar || FALLBACK_AVATAR} alt="avatar" onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }} />
                <div className="input-wrap">
                  <input
                    placeholder="Add a comment…"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <button className="yt-comment-submit" onClick={handleAddComment}>Comment</button>
                </div>
              </div>
            ) : (
              <p style={{ color: '#aaa', marginBottom: '24px', fontSize: '13px' }}>
                <Link to="/login" style={{ color: '#3ea6ff' }}>Sign in</Link> to comment
              </p>
            )}

            {comments.map((c) => (
              <div key={c._id} className="yt-comment">
                <img
                  src={c.userId?.avatar || FALLBACK_AVATAR}
                  alt="avatar"
                  onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
                />
                <div className="yt-comment__body">
                  <div className="yt-comment__header">
                    <span className="yt-comment__author">{c.userId?.username}</span>
                    <span className="yt-comment__date">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>

                  {editingComment === c._id ? (
                    <div className="yt-comment__edit-wrap">
                      <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                      <div className="yt-comment__edit-btns">
                        <button className="save"   onClick={() => handleEditComment(c._id)}>Save</button>
                        <button className="cancel" onClick={() => setEditingComment(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="yt-comment__text">{c.text}</p>
                  )}

                  {user && user._id === c.userId?._id && (
                    <div className="yt-comment__actions">
                      <button className="yt-comment__action-btn" onClick={() => { setEditingComment(c._id); setEditText(c.text); }}>Edit</button>
                      <button className="yt-comment__action-btn delete" onClick={() => handleDeleteComment(c._id)}>Delete</button>
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
