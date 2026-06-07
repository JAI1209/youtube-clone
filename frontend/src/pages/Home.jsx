import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import VideoCard from '../components/VideoCard';
import FilterBar from '../components/FilterBar';
import axios from '../api/axios';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVideos = useCallback(async (search = '', category = 'All') => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await axios.get('/videos', { params });
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos(searchTerm, activeFilter);
  }, [activeFilter, fetchVideos]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchVideos(term, activeFilter);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onSearch={handleSearch}
      />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`mt-14 px-6 transition-all duration-200 ${sidebarOpen ? 'ml-60' : 'ml-[72px]'}`}>
        <div className="sticky top-14 bg-[#0f0f0f] z-10 pt-2">
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-lg">
            Loading...
          </div>
        ) : videos.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-lg">
            No videos found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4 pb-8">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;