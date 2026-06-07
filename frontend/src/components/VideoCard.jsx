import { Link } from 'react-router-dom';

const FALLBACK_THUMB  = 'https://placehold.co/320x180/272727/aaaaaa?text=No+Thumbnail';
const FALLBACK_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

const fmtViews = (v) => {
  if (!v) return '0 views';
  if (v >= 1_000_000) return `${(v/1_000_000).toFixed(1)}M views`;
  if (v >= 1_000)     return `${(v/1_000).toFixed(1)}K views`;
  return `${v} views`;
};

const fmtDate = (d) => {
  if (!d) return '';
  const days = Math.floor((Date.now() - new Date(d)) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30)  return `${days} days ago`;
  if (days < 365) return `${Math.floor(days/30)} months ago`;
  return `${Math.floor(days/365)} years ago`;
};

const VideoCard = ({ video }) => (
  <Link to={`/video/${video._id}`} className="yt-card">
    <div className="yt-card__thumb">
      <img
        src={video.thumbnailUrl || FALLBACK_THUMB}
        alt={video.title}
        onError={(e) => { e.currentTarget.src = FALLBACK_THUMB; }}
      />
    </div>
    <div className="yt-card__meta">
      <img
        src={video.uploader?.avatar || FALLBACK_AVATAR}
        alt="channel"
        className="yt-card__avatar"
        onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
      />
      <div className="yt-card__info">
        <div className="yt-card__title">{video.title}</div>
        <div className="yt-card__channel">
          {video.channelId?.channelName || 'Unknown Channel'}
        </div>
        <div className="yt-card__stats">
          {fmtViews(video.views)} • {fmtDate(video.createdAt || video.uploadDate)}
        </div>
      </div>
    </div>
  </Link>
);

export default VideoCard;
