import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import VideoCard from '../components/VideoCard';
import FilterBar from '../components/FilterBar';
import axios from '../api/axios';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVideos = async (search = '', category = 'All') => {
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
  };

  useEffect(() => {
    fetchVideos(searchTerm, activeFilter);
  }, [activeFilter]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchVideos(term, activeFilter);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const sidebarWidth = sidebarOpen ? 240 : 72;

  return (
    <div style={styles.container}>
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onSearch={handleSearch}
      />
      <Sidebar isOpen={sidebarOpen} />

      <main style={{ ...styles.main, marginLeft: sidebarWidth }}>
        <div style={styles.filterWrapper}>
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : videos.length === 0 ? (
          <div style={styles.noVideos}>No videos found</div>
        ) : (
          <div style={styles.grid}>
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: { background: '#0f0f0f', minHeight: '100vh' },
  main: {
    marginTop: '56px',
    padding: '0 24px',
    transition: 'margin-left 0.2s ease',
  },
  filterWrapper: {
    position: 'sticky',
    top: '56px',
    background: '#0f0f0f',
    zIndex: 100,
    paddingTop: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    paddingBottom: '24px',
    paddingTop: '16px',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    color: '#aaa',
    fontSize: '18px',
  },
  noVideos: {
    textAlign: 'center',
    padding: '50px',
    color: '#aaa',
    fontSize: '18px',
  },
};

export default Home;