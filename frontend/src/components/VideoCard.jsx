import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  const formatDate = (date) => {
    const diff = Date.now() - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  return (
    <Link to={`/video/${video._id}`} style={styles.card}>
      <div style={styles.thumbnailContainer}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          style={styles.thumbnail}
          onError={(e) => e.target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail'}
        />
      </div>
      <div style={styles.info}>
        <img
          src={video.uploader?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
          alt="channel"
          style={styles.channelAvatar}
        />
        <div style={styles.details}>
          <h3 style={styles.title}>{video.title}</h3>
          <p style={styles.channelName}>
            {video.channelId?.channelName || 'Unknown Channel'}
          </p>
          <p style={styles.meta}>
            {formatViews(video.views)} • {formatDate(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.2s',
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: '16/9',
    overflow: 'hidden',
    borderRadius: '12px',
    background: '#272727',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  info: {
    display: 'flex',
    gap: '12px',
    padding: '12px 4px',
  },
  channelAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  details: { flex: 1 },
  title: {
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '1.4',
    marginBottom: '4px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  channelName: {
    fontSize: '12px',
    color: '#aaa',
    marginBottom: '2px',
  },
  meta: {
    fontSize: '12px',
    color: '#aaa',
  },
};

export default VideoCard;