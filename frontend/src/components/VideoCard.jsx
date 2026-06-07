import { Link } from 'react-router-dom';

const formatViews = (views) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
  return `${views} views`;
};

const formatDate = (date) => {
  const diff = new Date().getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
};

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`} className="flex flex-col cursor-pointer text-white no-underline rounded-xl overflow-hidden group">
      <div className="w-full aspect-video overflow-hidden rounded-xl bg-[#272727]">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => e.target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail'}
        />
      </div>
      <div className="flex gap-3 p-3">
        <img
          src={video.uploader?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
          alt="channel"
          className="w-9 h-9 rounded-full flex-shrink-0"
        />
        <div className="flex-1">
          <h3 className="text-sm font-semibold leading-snug mb-1 line-clamp-2">{video.title}</h3>
          <p className="text-xs text-gray-400 mb-1">{video.channelId?.channelName || 'Unknown Channel'}</p>
          <p className="text-xs text-gray-400">{formatViews(video.views)} • {formatDate(video.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;