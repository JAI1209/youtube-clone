import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🔥', label: 'Trending', path: '/' },
    { icon: '📺', label: 'Subscriptions', path: '/' },
    { icon: '📚', label: 'Library', path: '/' },
    { icon: '🕐', label: 'History', path: '/' },
    { icon: '▶️', label: 'Your Videos', path: '/channel/my' },
    { icon: '⏰', label: 'Watch Later', path: '/' },
    { icon: '👍', label: 'Liked Videos', path: '/' },
  ];

  const exploreItems = [
    { icon: '🎵', label: 'Music', path: '/' },
    { icon: '🎮', label: 'Gaming', path: '/' },
    { icon: '📰', label: 'News', path: '/' },
    { icon: '🏆', label: 'Sports', path: '/' },
  ];

  return (
    <aside className={`fixed top-14 left-0 bottom-0 bg-[#0f0f0f] overflow-y-auto transition-all duration-200 z-40 pt-3 ${isOpen ? 'w-60' : 'w-[72px]'}`}>
      <div className="flex flex-col">
        {menuItems.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className="flex items-center gap-4 px-4 py-2 text-white rounded-xl mx-2 hover:bg-[#272727] transition-colors text-sm"
          >
            <span className="text-xl min-w-[24px] text-center">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </div>

      {isOpen && (
        <>
          <div className="h-px bg-[#272727] my-3" />
          <div className="px-4 py-2 text-base font-bold text-white">Explore</div>
          <div className="flex flex-col">
            {exploreItems.map((item, index) => (
              <Link
                to={item.path}
                key={index}
                className="flex items-center gap-4 px-4 py-2 text-white rounded-xl mx-2 hover:bg-[#272727] transition-colors text-sm"
              >
                <span className="text-xl min-w-[24px] text-center">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;