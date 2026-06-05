import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import VideoCard from '../components/VideoCard';
import axios from '../api/axios';

const ChannelPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showUploadVideo, setShowUploadVideo] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [myChannels, setMyChannels] = useState([]);

  const [channelForm, setChannelForm] = useState({
    channelName: '', description: ''
  });

  const [videoForm, setVideoForm] = useState({
    title: '', description: '', videoUrl: '',
    thumbnailUrl: '', category: 'Web Development'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (id === 'my') {
      fetchMyChannels();
    } else {
      fetchChannel();
    }
  }, [id, user]);

  const fetchChannel = async () => {
    try {
      const { data } = await axios.get(`/channels/${id}`);
      setChannel(data);
    } catch (error) {
      console.error('Error fetching channel:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyChannels = async () => {
    try {
      const { data } = await axios.get('/channels/my');
      setMyChannels(data);
      if (data.length > 0) setChannel(data[0]);
    } catch (error) {
      console.error('Error fetching my channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChannel = async () => {
    try {
      const { data } = await axios.post('/channels', channelForm);
      setMyChannels([...myChannels, data]);
      setChannel(data);
      setShowCreateChannel(false);
      setChannelForm({ channelName: '', description: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating channel');
    }
  };

  const handleUploadVideo = async () => {
    try {
      const { data } = await axios.post('/videos', {
        ...videoForm,
        channelId: channel._id
      });
      setChannel({ ...channel, videos: [data, ...channel.videos] });
      setShowUploadVideo(false);
      setVideoForm({
        title: '', description: '', videoUrl: '',
        thumbnailUrl: '', category: 'Web Development'
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Error uploading video');
    }
  };

  const handleUpdateVideo = async () => {
    try {
      const { data } = await axios.put(`/videos/${editingVideo._id}`, videoForm);
      setChannel({
        ...channel,
        videos: channel.videos.map(v => v._id === data._id ? data : v)
      });
      setEditingVideo(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating video');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await axios.delete(`/videos/${videoId}`);
      setChannel({
        ...channel,
        videos: channel.videos.filter(v => v._id !== videoId)
      });
    } catch (error) {
      alert('Error deleting video');
    }
  };

  const isOwner = channel && user && channel.owner?._id === user._id;

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onSearch={() => {}}
      />
      <Sidebar isOpen={sidebarOpen} />

      <main style={{ ...styles.main, marginLeft: sidebarOpen ? 240 : 72 }}>
        {/* No Channel */}
        {!channel && id === 'my' && (
          <div style={styles.noChannel}>
            <h2 style={styles.noChannelTitle}>You don't have a channel yet!</h2>
            <p style={styles.noChannelText}>Create a channel to upload videos</p>
            <button
              onClick={() => setShowCreateChannel(true)}
              style={styles.createBtn}
            >
              Create Channel
            </button>
          </div>
        )}

        {/* Channel Info */}
        {channel && (
          <>
            <div style={styles.channelBanner}>
              <img
                src={channel.channelBanner || 'https://via.placeholder.com/1280x200?text=Channel+Banner'}
                alt="banner"
                style={styles.bannerImg}
              />
            </div>

            <div style={styles.channelInfo}>
              <div style={styles.channelAvatar}>
                {channel.channelName?.charAt(0).toUpperCase()}
              </div>
              <div style={styles.channelDetails}>
                <h1 style={styles.channelName}>{channel.channelName}</h1>
                <p style={styles.channelDesc}>{channel.description}</p>
                <p style={styles.subscribers}>{channel.subscribers} subscribers</p>
              </div>
              {isOwner && (
                <button
                  onClick={() => setShowUploadVideo(true)}
                  style={styles.uploadBtn}
                >
                  + Upload Video
                </button>
              )}
            </div>

            {/* Videos Grid */}
            <div style={styles.videosSection}>
              <h2 style={styles.sectionTitle}>Videos</h2>
              {channel.videos?.length === 0 ? (
                <p style={styles.noVideos}>No videos yet</p>
              ) : (
                <div style={styles.grid}>
                  {channel.videos?.map((video) => (
                    <div key={video._id} style={styles.videoWrapper}>
                      <VideoCard video={video} />
                      {isOwner && (
                        <div style={styles.videoActions}>
                          <button
                            onClick={() => {
                              setEditingVideo(video);
                              setVideoForm({
                                title: video.title,
                                description: video.description,
                                videoUrl: video.videoUrl,
                                thumbnailUrl: video.thumbnailUrl,
                                category: video.category
                              });
                            }}
                            style={styles.editBtn}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video._id)}
                            style={styles.deleteBtn}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Create Channel Modal */}
        {showCreateChannel && (
          <div style={styles.modal}>
            <div style={styles.modalBox}>
              <h2 style={styles.modalTitle}>Create Channel</h2>
              <input
                placeholder="Channel Name"
                value={channelForm.channelName}
                onChange={(e) => setChannelForm({ ...channelForm, channelName: e.target.value })}
                style={styles.input}
              />
              <textarea
                placeholder="Channel Description"
                value={channelForm.description}
                onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })}
                style={styles.textarea}
              />
              <div style={styles.modalBtns}>
                <button onClick={handleCreateChannel} style={styles.submitBtn}>
                  Create Channel
                </button>
                <button onClick={() => setShowCreateChannel(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload/Edit Video Modal */}
        {(showUploadVideo || editingVideo) && (
          <div style={styles.modal}>
            <div style={styles.modalBox}>
              <h2 style={styles.modalTitle}>
                {editingVideo ? 'Edit Video' : 'Upload Video'}
              </h2>
              <input
                placeholder="Video Title"
                value={videoForm.title}
                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                style={styles.input}
              />
              <textarea
                placeholder="Video Description"
                value={videoForm.description}
                onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                style={styles.textarea}
              />
              <input
                placeholder="Video URL"
                value={videoForm.videoUrl}
                onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                style={styles.input}
              />
              <input
                placeholder="Thumbnail URL"
                value={videoForm.thumbnailUrl}
                onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                style={styles.input}
              />
              <select
                value={videoForm.category}
                onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                style={styles.select}
              >
                <option>Web Development</option>
                <option>JavaScript</option>
                <option>React</option>
                <option>Node.js</option>
                <option>Python</option>
                <option>Data Structures</option>
                <option>Music</option>
                <option>Gaming</option>
                <option>News</option>
              </select>
              <div style={styles.modalBtns}>
                <button
                  onClick={editingVideo ? handleUpdateVideo : handleUploadVideo}
                  style={styles.submitBtn}
                >
                  {editingVideo ? 'Update Video' : 'Upload Video'}
                </button>
                <button
                  onClick={() => { setShowUploadVideo(false); setEditingVideo(null); }}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: { background: '#0f0f0f', minHeight: '100vh' },
  main: { marginTop: '56px', padding: '0', transition: 'margin-left 0.2s' },
  loading: { color: '#fff', textAlign: 'center', padding: '50px', fontSize: '18px' },
  noChannel: { textAlign: 'center', padding: '80px 20px' },
  noChannelTitle: { color: '#fff', fontSize: '24px', marginBottom: '12px' },
  noChannelText: { color: '#aaa', marginBottom: '24px' },
  createBtn: {
    padding: '12px 24px', borderRadius: '8px', border: 'none',
    background: '#ff0000', color: '#fff', fontSize: '16px', cursor: 'pointer',
  },
  channelBanner: { width: '100%', height: '200px', overflow: 'hidden' },
  bannerImg: { width: '100%', height: '100%', objectFit: 'cover' },
  channelInfo: {
    display: 'flex', alignItems: 'center', gap: '20px',
    padding: '24px', flexWrap: 'wrap',
  },
  channelAvatar: {
    width: '80px', height: '80px', borderRadius: '50%',
    background: '#ff0000', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '36px', color: '#fff', fontWeight: 'bold',
  },
  channelDetails: { flex: 1 },
  channelName: { color: '#fff', fontSize: '24px', marginBottom: '4px' },
  channelDesc: { color: '#aaa', fontSize: '14px', marginBottom: '4px' },
  subscribers: { color: '#aaa', fontSize: '14px' },
  uploadBtn: {
    padding: '10px 20px', borderRadius: '8px', border: 'none',
    background: '#ff0000', color: '#fff', fontSize: '14px', cursor: 'pointer',
  },
  videosSection: { padding: '0 24px 24px' },
  sectionTitle: { color: '#fff', fontSize: '20px', marginBottom: '16px' },
  noVideos: { color: '#aaa', fontSize: '16px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  videoWrapper: { position: 'relative' },
  videoActions: {
    display: 'flex', gap: '8px', marginTop: '8px',
    justifyContent: 'flex-end',
  },
  editBtn: {
    padding: '6px 12px', borderRadius: '6px', border: 'none',
    background: '#3ea6ff', color: '#000', cursor: 'pointer', fontSize: '12px',
  },
  deleteBtn: {
    padding: '6px 12px', borderRadius: '6px', border: 'none',
    background: '#ff4444', color: '#fff', cursor: 'pointer', fontSize: '12px',
  },
  modal: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.8)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 2000,
  },
  modalBox: {
    background: '#212121', padding: '32px', borderRadius: '12px',
    width: '90%', maxWidth: '500px', display: 'flex',
    flexDirection: 'column', gap: '16px',
    maxHeight: '90vh', overflowY: 'auto',
  },
  modalTitle: { color: '#fff', fontSize: '20px' },
  input: {
    padding: '12px 16px', borderRadius: '8px',
    border: '1px solid #303030', background: '#121212',
    color: '#fff', fontSize: '14px', outline: 'none',
  },
  textarea: {
    padding: '12px 16px', borderRadius: '8px',
    border: '1px solid #303030', background: '#121212',
    color: '#fff', fontSize: '14px', outline: 'none',
    minHeight: '80px', resize: 'vertical',
  },
  select: {
    padding: '12px 16px', borderRadius: '8px',
    border: '1px solid #303030', background: '#121212',
    color: '#fff', fontSize: '14px', outline: 'none',
  },
  modalBtns: { display: 'flex', gap: '12px' },
  submitBtn: {
    flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
    background: '#ff0000', color: '#fff', fontSize: '14px',
    fontWeight: 'bold', cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
    background: '#272727', color: '#fff', fontSize: '14px', cursor: 'pointer',
  },
};

export default ChannelPage;