import { useState, useEffect, useCallback } from 'react';
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

  const [channelForm, setChannelForm] = useState({ channelName: '', description: '' });
  const [videoForm, setVideoForm] = useState({
    title: '', description: '', videoUrl: '',
    thumbnailUrl: '', category: 'Web Development'
  });

  const fetchChannel = useCallback(async () => {
    try {
      const { data } = await axios.get(`/channels/${id}`);
      setChannel(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchMyChannels = useCallback(async () => {
    try {
      const { data } = await axios.get('/channels/my');
      setMyChannels(data);
      if (data.length > 0) setChannel(data[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (id === 'my') fetchMyChannels();
    else fetchChannel();
  }, [id, user, navigate, fetchChannel, fetchMyChannels]);

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
      const { data } = await axios.post('/videos', { ...videoForm, channelId: channel._id });
      setChannel({ ...channel, videos: [data, ...channel.videos] });
      setShowUploadVideo(false);
      setVideoForm({ title: '', description: '', videoUrl: '', thumbnailUrl: '', category: 'Web Development' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error uploading video');
    }
  };

  const handleUpdateVideo = async () => {
    try {
      const { data } = await axios.put(`/videos/${editingVideo._id}`, videoForm);
      setChannel({ ...channel, videos: channel.videos.map(v => v._id === data._id ? data : v) });
      setEditingVideo(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating video');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await axios.delete(`/videos/${videoId}`);
      setChannel({ ...channel, videos: channel.videos.filter(v => v._id !== videoId) });
    } catch (error) {
      alert('Error deleting video');
    }
  };

  const isOwner = channel && user && channel.owner?._id === user._id;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white text-xl">Loading...</div>
  );

  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} onSearch={() => {}} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`mt-14 transition-all duration-200 ${sidebarOpen ? 'ml-60' : 'ml-[72px]'}`}>

        {!channel && id === 'my' && (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <h2 className="text-white text-2xl font-bold">You don't have a channel yet!</h2>
            <p className="text-gray-400">Create a channel to upload videos</p>
            <button onClick={() => setShowCreateChannel(true)} className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">
              Create Channel
            </button>
          </div>
        )}

        {channel && (
          <>
            <div className="w-full h-48 overflow-hidden">
              <img
                src={channel.channelBanner || 'https://via.placeholder.com/1280x200?text=Channel+Banner'}
                alt="banner"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-5 p-6">
              <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-4xl text-white font-bold">
                {channel.channelName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-white text-2xl font-bold">{channel.channelName}</h1>
                <p className="text-gray-400 text-sm">{channel.description}</p>
                <p className="text-gray-400 text-sm">{channel.subscribers} subscribers</p>
              </div>
              {isOwner && (
                <button
                  onClick={() => setShowUploadVideo(true)}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  + Upload Video
                </button>
              )}
            </div>

            <div className="px-6 pb-8">
              <h2 className="text-white text-xl font-semibold mb-4">Videos</h2>
              {channel.videos?.length === 0 ? (
                <p className="text-gray-400">No videos yet</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {channel.videos?.map((video) => (
                    <div key={video._id} className="relative">
                      <VideoCard video={video} />
                      {isOwner && (
                        <div className="flex gap-2 mt-2 justify-end">
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
                            className="px-3 py-1 bg-[#3ea6ff] text-black rounded-lg text-xs font-semibold hover:bg-blue-400"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600"
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

        {showCreateChannel && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
            <div className="bg-[#212121] p-8 rounded-xl w-full max-w-md flex flex-col gap-4">
              <h2 className="text-white text-xl font-bold">Create Channel</h2>
              <input
                placeholder="Channel Name"
                value={channelForm.channelName}
                onChange={(e) => setChannelForm({ ...channelForm, channelName: e.target.value })}
                className="px-4 py-3 rounded-lg border border-[#303030] bg-[#121212] text-white outline-none"
              />
              <textarea
                placeholder="Channel Description"
                value={channelForm.description}
                onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })}
                className="px-4 py-3 rounded-lg border border-[#303030] bg-[#121212] text-white outline-none min-h-[80px] resize-none"
              />
              <div className="flex gap-3">
                <button onClick={handleCreateChannel} className="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700">Create</button>
                <button onClick={() => setShowCreateChannel(false)} className="flex-1 py-3 bg-[#272727] text-white rounded-lg hover:bg-[#3f3f3f]">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {(showUploadVideo || editingVideo) && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
            <div className="bg-[#212121] p-8 rounded-xl w-full max-w-md flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-white text-xl font-bold">{editingVideo ? 'Edit Video' : 'Upload Video'}</h2>
              <input
                placeholder="Video Title"
                value={videoForm.title}
                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                className="px-4 py-3 rounded-lg border border-[#303030] bg-[#121212] text-white outline-none"
              />
              <textarea
                placeholder="Video Description"
                value={videoForm.description}
                onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                className="px-4 py-3 rounded-lg border border-[#303030] bg-[#121212] text-white outline-none min-h-[80px] resize-none"
              />
              <input
                placeholder="Video URL"
                value={videoForm.videoUrl}
                onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                className="px-4 py-3 rounded-lg border border-[#303030] bg-[#121212] text-white outline-none"
              />
              <input
                placeholder="Thumbnail URL"
                value={videoForm.thumbnailUrl}
                onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                className="px-4 py-3 rounded-lg border border-[#303030] bg-[#121212] text-white outline-none"
              />
              <select
                value={videoForm.category}
                onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                className="px-4 py-3 rounded-lg border border-[#303030] bg-[#121212] text-white outline-none"
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
              <div className="flex gap-3">
                <button
                  onClick={editingVideo ? handleUpdateVideo : handleUploadVideo}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                >
                  {editingVideo ? 'Update' : 'Upload'}
                </button>
                <button
                  onClick={() => { setShowUploadVideo(false); setEditingVideo(null); }}
                  className="flex-1 py-3 bg-[#272727] text-white rounded-lg hover:bg-[#3f3f3f]"
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

export default ChannelPage;