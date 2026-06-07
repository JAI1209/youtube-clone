import { Link, useLocation } from 'react-router-dom';
import {
  MdHomeFilled, MdOutlineLocalFireDepartment, MdSubscriptions,
  MdVideoLibrary, MdHistory, MdVideoCall,
  MdWatchLater, MdThumbUp, MdMusicNote,
  MdSportsEsports, MdArticle, MdSportsSoccer
} from 'react-icons/md';

const mainItems = [
  { icon: MdHomeFilled,                  label: 'Home',          path: '/' },
  { icon: MdOutlineLocalFireDepartment,  label: 'Trending',      path: '/' },
  { icon: MdSubscriptions,              label: 'Subscriptions', path: '/' },
  { icon: MdVideoLibrary,               label: 'Library',       path: '/' },
  { icon: MdHistory,                    label: 'History',       path: '/' },
  { icon: MdVideoCall,                  label: 'Your Videos',   path: '/channel/my' },
  { icon: MdWatchLater,                 label: 'Watch Later',   path: '/' },
  { icon: MdThumbUp,                    label: 'Liked Videos',  path: '/' },
];

const exploreItems = [
  { icon: MdMusicNote,      label: 'Music',   path: '/' },
  { icon: MdSportsEsports,  label: 'Gaming',  path: '/' },
  { icon: MdArticle,        label: 'News',    path: '/' },
  { icon: MdSportsSoccer,   label: 'Sports',  path: '/' },
];

const NavItem = ({ item, isOpen }) => {
  const location = useLocation();
  const active = location.pathname === item.path && item.path === '/channel/my';
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className={`yt-nav-item${active ? ' active' : ''}`}
      title={!isOpen ? item.label : undefined}
    >
      <Icon className="yt-nav-icon" />
      <span className="yt-nav-label">{item.label}</span>
    </Link>
  );
};

const Sidebar = ({ isOpen }) => (
  <aside className={`yt-sidebar ${isOpen ? 'open' : 'closed'}`}>
    <div>
      {mainItems.map((item) => (
        <NavItem key={item.label} item={item} isOpen={isOpen} />
      ))}
    </div>

    {isOpen && (
      <>
        <div className="yt-sidebar__divider" />
        <div className="yt-sidebar__section-title">Explore</div>
        <div>
          {exploreItems.map((item) => (
            <NavItem key={item.label} item={item} isOpen={isOpen} />
          ))}
        </div>
      </>
    )}
  </aside>
);

export default Sidebar;
