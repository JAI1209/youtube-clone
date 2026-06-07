import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import VideoCard from '../components/VideoCard';
import FilterBar from '../components/FilterBar';
import axios from '../api/axios';

const Home = () => {
  const [videos, setVideos]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm]   = useState('');

  const fetchVideos = useCallback(async (search = '', category = 'All') => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await axios.get('/videos', { params });
      setVideos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVideos(searchTerm, activeFilter); }, [activeFilter, fetchVideos]);

  const handleSearch = (term) => { setSearchTerm(term); fetchVideos(term, activeFilter); };

  return (
    <div className="yt-app">
      <Header onMenuClick={() => setSidebarOpen((v) => !v)} onSearch={handleSearch} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`yt-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {loading ? (
          <div className="yt-empty">Loading...</div>
        ) : videos.length === 0 ? (
          <div className="yt-empty">No videos found</div>
        ) : (
          <div className="yt-grid">
            {videos.map((v) => <VideoCard key={v._id} video={v} />)}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
