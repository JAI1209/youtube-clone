import { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const { data } = await axios.get(`/videos/${id}`);
      setVideo(data);
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/comments/${id}`);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

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

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!video) return <div style={styles.loading}>Video not found</div>;

  return (
    <div style={styles.container}>
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onSearch={() => {}}
      />
      <Sidebar isOpen={sidebarOpen} />

      <main style={{ ...styles.main, marginLeft: sidebarOpen ? 240 : 72 }}>
        <div style={styles.content}>
          {/* Video Player */}
          <div style={styles.videoSection}>
            <video
              src={video.videoUrl}
              controls
              style={styles.videoPlayer}
            />

            <h1 style={styles.videoTitle}>{video.title}</h1>

            <div style={styles.videoMeta}>
              <div style={styles.channelInfo}>
                <Link to={`/channel/${video.channelId?._id}`} style={styles.channelLink}>
                  <strong>{video.channelId?.channelName}</strong>
                </Link>
                <span style={styles.views}>{video.views} views</span>
              </div>

              {/* Like/Dislike */}
              <div style={styles.actions}>
                <button
                  onClick={handleLike}
                  style={{ ...styles.actionBtn, ...(isLiked ? styles.activeBtn : {}) }}
                >
                  👍 {video.likes?.length || 0}
                </button>
                <button
                  onClick={handleDislike}
                  style={{ ...styles.actionBtn, ...(isDisliked ? styles.activeBtn : {}) }}
                >
                  👎 {video.dislikes?.length || 0}
                </button>
              </div>
            </div>

            {/* Description */}
            <div style={styles.description}>
              <p>{video.description}</p>
            </div>

            {/* Comments */}
            <div style={styles.commentsSection}>
              <h3 style={styles.commentsTitle}>
                {comments.length} Comments
              </h3>

              {/* Add Comment */}
              {user ? (
                <div style={styles.addComment}>
                  <img
                    src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt="avatar"
                    style={styles.commentAvatar}
                  />
                  <div style={styles.commentInput}>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={styles.input}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button onClick={handleAddComment} style={styles.submitBtn}>
                      Comment
                    </button>
                  </div>
                </div>
              ) : (
                <p style={styles.signInPrompt}>
                  <Link to="/login" style={styles.link}>Sign in</Link> to comment
                </p>
              )}

              {/* Comments List */}
              {comments.map((comment) => (
                <div key={comment._id} style={styles.comment}>
                  <img
                    src={comment.userId?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt="avatar"
                    style={styles.commentAvatar}
                  />
                  <div style={styles.commentContent}>
                    <div style={styles.commentHeader}>
                      <strong style={styles.commentUsername}>
                        {comment.userId?.username}
                      </strong>
                      <span style={styles.commentDate}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {editingComment === comment._id ? (
                      <div style={styles.editSection}>
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          style={styles.input}
                        />
                        <div style={styles.editBtns}>
                          <button
                            onClick={() => handleEditComment(comment._id)}
                            style={styles.saveBtn}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingComment(null)}
                            style={styles.cancelBtn}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p style={styles.commentText}>{comment.text}</p>
                    )}

                    {user && user._id === comment.userId?._id && (
                      <div style={styles.commentActions}>
                        <button
                          onClick={() => {
                            setEditingComment(comment._id);
                            setEditText(comment.text);
                          }}
                          style={styles.editBtn}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          style={styles.deleteBtn}
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
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: { background: '#0f0f0f', minHeight: '100vh' },
  main: { marginTop: '56px', padding: '24px', transition: 'margin-left 0.2s' },
  content: { maxWidth: '900px', margin: '0 auto' },
  videoSection: { width: '100%' },
  videoPlayer: { width: '100%', borderRadius: '12px', background: '#000', maxHeight: '500px' },
  videoTitle: { fontSize: '20px', fontWeight: 'bold', color: '#fff', margin: '16px 0 8px' },
  videoMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  channelInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  channelLink: { color: '#fff', fontSize: '16px' },
  views: { color: '#aaa', fontSize: '14px' },
  actions: { display: 'flex', gap: '8px' },
  actionBtn: {
    padding: '8px 16px', borderRadius: '20px', border: 'none',
    background: '#272727', color: '#fff', fontSize: '14px', cursor: 'pointer',
  },
  activeBtn: { background: '#3ea6ff', color: '#000' },
  description: {
    background: '#212121', padding: '16px', borderRadius: '12px',
    margin: '16px 0', color: '#aaa', fontSize: '14px',
  },
  commentsSection: { marginTop: '24px' },
  commentsTitle: { fontSize: '18px', color: '#fff', marginBottom: '16px' },
  addComment: { display: 'flex', gap: '12px', marginBottom: '24px' },
  commentAvatar: { width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 },
  commentInput: { flex: 1, display: 'flex', gap: '8px' },
  input: {
    flex: 1, padding: '10px 16px', borderRadius: '8px',
    border: '1px solid #303030', background: '#121212',
    color: '#fff', fontSize: '14px', outline: 'none',
  },
  submitBtn: {
    padding: '10px 16px', borderRadius: '8px', border: 'none',
    background: '#3ea6ff', color: '#000', fontWeight: 'bold', cursor: 'pointer',
  },
  signInPrompt: { color: '#aaa', marginBottom: '24px' },
  link: { color: '#3ea6ff' },
  comment: { display: 'flex', gap: '12px', marginBottom: '20px' },
  commentContent: { flex: 1 },
  commentHeader: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' },
  commentUsername: { color: '#fff', fontSize: '13px' },
  commentDate: { color: '#aaa', fontSize: '12px' },
  commentText: { color: '#fff', fontSize: '14px', lineHeight: '1.5' },
  commentActions: { display: 'flex', gap: '8px', marginTop: '8px' },
  editBtn: {
    background: 'none', border: 'none', color: '#3ea6ff',
    cursor: 'pointer', fontSize: '12px',
  },
  deleteBtn: {
    background: 'none', border: 'none', color: '#ff4444',
    cursor: 'pointer', fontSize: '12px',
  },
  editSection: { display: 'flex', flexDirection: 'column', gap: '8px' },
  editBtns: { display: 'flex', gap: '8px' },
  saveBtn: {
    padding: '6px 12px', borderRadius: '6px', border: 'none',
    background: '#3ea6ff', color: '#000', cursor: 'pointer', fontSize: '12px',
  },
  cancelBtn: {
    padding: '6px 12px', borderRadius: '6px', border: 'none',
    background: '#272727', color: '#fff', cursor: 'pointer', fontSize: '12px',
  },
  loading: { color: '#fff', textAlign: 'center', padding: '50px', fontSize: '18px' },
};

export default VideoPlayer;