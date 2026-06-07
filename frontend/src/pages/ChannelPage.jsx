import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import VideoCard from '../components/VideoCard';
import axios from '../api/axios';

const CATEGORIES = ['Web Development','JavaScript','React','Node.js','Python','Data Structures','Music','Gaming','News'];

const ChannelPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [channel, setChannel]               = useState(null);
  const [loading, setLoading]               = useState(true);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [showCreateChannel, setShowCreate]  = useState(false);
  const [showUploadVideo, setShowUpload]    = useState(false);
  const [editingVideo, setEditingVideo]     = useState(null);
  const [myChannels, setMyChannels]         = useState([]);
  const [channelForm, setChannelForm]       = useState({ channelName: '', description: '' });
  const [videoForm, setVideoForm]           = useState({ title:'', description:'', videoUrl:'', thumbnailUrl:'', category:'Web Development' });

  const fetchChannel = useCallback(async () => {
    try { const { data } = await axios.get(`/channels/${id}`); setChannel(data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [id]);

  const fetchMyChannels = useCallback(async () => {
    try {
      const { data } = await axios.get('/channels/my');
      setMyChannels(data);
      if (data.length > 0) setChannel(data[0]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (id === 'my') fetchMyChannels(); else fetchChannel();
  }, [id, user, navigate, fetchChannel, fetchMyChannels]);

  const handleCreateChannel = async () => {
    try {
      const { data } = await axios.post('/channels', channelForm);
      setMyChannels([...myChannels, data]); setChannel(data); setShowCreate(false);
      setChannelForm({ channelName: '', description: '' });
    } catch (e) { alert(e.response?.data?.message || 'Error creating channel'); }
  };

  const handleUploadVideo = async () => {
    try {
      const { data } = await axios.post('/videos', { ...videoForm, channelId: channel._id });
      setChannel({ ...channel, videos: [data, ...(channel.videos || [])] });
      setShowUpload(false);
      setVideoForm({ title:'', description:'', videoUrl:'', thumbnailUrl:'', category:'Web Development' });
    } catch (e) { alert(e.response?.data?.message || 'Error uploading video'); }
  };

  const handleUpdateVideo = async () => {
    try {
      const { data } = await axios.put(`/videos/${editingVideo._id}`, videoForm);
      setChannel({ ...channel, videos: channel.videos.map(v => v._id === data._id ? data : v) });
      setEditingVideo(null);
    } catch (e) { alert(e.response?.data?.message || 'Error updating video'); }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await axios.delete(`/videos/${videoId}`);
      setChannel({ ...channel, videos: channel.videos.filter(v => v._id !== videoId) });
    } catch (e) { alert('Error deleting video'); }
  };

  const isOwner = channel && user && channel.owner?._id === user._id;

  if (loading) return <div className="yt-empty" style={{ minHeight: '100vh', background: '#0f0f0f' }}>Loading...</div>;

  return (
    <div className="yt-app">
      <Header onMenuClick={() => setSidebarOpen((v) => !v)} onSearch={() => {}} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`yt-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>

        {/* No channel yet */}
        {!channel && id === 'my' && (
          <div className="yt-empty" style={{ flexDirection: 'column', gap: '16px', minHeight: '60vh' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700 }}>You don't have a channel yet!</h2>
            <p style={{ color: '#aaa' }}>Create a channel to start uploading</p>
            <button className="yt-upload-btn" onClick={() => setShowCreate(true)}>+ Create Channel</button>
          </div>
        )}

        {/* Channel content */}
        {channel && (
          <>
            {/* Banner */}
            <div className="yt-channel-banner">
              <img
                src={channel.channelBanner || 'https://placehold.co/1280x200/212121/555?text=Channel+Banner'}
                alt="banner"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/1280x200/212121/555?text=Channel+Banner'; }}
              />
            </div>

            {/* Channel info */}
            <div className="yt-channel-info">
              <div className="yt-channel-avatar">
                {channel.channelName?.charAt(0).toUpperCase()}
              </div>
              <div className="yt-channel-meta">
                <div className="yt-channel-name">{channel.channelName}</div>
                <div className="yt-channel-desc">{channel.description}</div>
                <div className="yt-channel-subs">{(channel.subscribers || 0).toLocaleString()} subscribers</div>
              </div>
              {isOwner && (
                <button className="yt-upload-btn" onClick={() => setShowUpload(true)}>
                  + Upload Video
                </button>
              )}
            </div>

            {/* Videos */}
            <div className="yt-channel-videos-title">Videos</div>
            {!channel.videos?.length ? (
              <div className="yt-empty">No videos yet</div>
            ) : (
              <div className="yt-grid">
                {channel.videos.map((video) => (
                  <div key={video._id}>
                    <VideoCard video={video} />
                    {isOwner && (
                      <div className="yt-video-actions">
                        <button
                          className="yt-video-edit-btn"
                          onClick={() => {
                            setEditingVideo(video);
                            setVideoForm({ title: video.title, description: video.description, videoUrl: video.videoUrl, thumbnailUrl: video.thumbnailUrl, category: video.category });
                          }}
                        >✏️ Edit</button>
                        <button className="yt-video-del-btn" onClick={() => handleDeleteVideo(video._id)}>🗑️ Delete</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Create Channel Modal */}
        {showCreateChannel && (
          <div className="yt-modal-overlay">
            <div className="yt-modal">
              <h2>Create Channel</h2>
              <input placeholder="Channel Name" value={channelForm.channelName} onChange={(e) => setChannelForm({ ...channelForm, channelName: e.target.value })} />
              <textarea placeholder="Channel Description" value={channelForm.description} onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })} />
              <div className="yt-modal-btns">
                <button className="primary"   onClick={handleCreateChannel}>Create</button>
                <button className="secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Upload / Edit Video Modal */}
        {(showUploadVideo || editingVideo) && (
          <div className="yt-modal-overlay">
            <div className="yt-modal">
              <h2>{editingVideo ? 'Edit Video' : 'Upload Video'}</h2>
              <input    placeholder="Video Title"       value={videoForm.title}        onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} />
              <textarea placeholder="Video Description" value={videoForm.description}  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} />
              <input    placeholder="Video URL"         value={videoForm.videoUrl}     onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })} />
              <input    placeholder="Thumbnail URL"     value={videoForm.thumbnailUrl} onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })} />
              <select value={videoForm.category} onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <div className="yt-modal-btns">
                <button className="primary"   onClick={editingVideo ? handleUpdateVideo : handleUploadVideo}>
                  {editingVideo ? 'Update' : 'Upload'}
                </button>
                <button className="secondary" onClick={() => { setShowUpload(false); setEditingVideo(null); }}>
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

export default ChannelPage;
