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
    <aside style={{ ...styles.sidebar, ...(isOpen ? styles.open : styles.closed) }}>
      <div style={styles.section}>
        {menuItems.map((item, index) => (
          <Link to={item.path} key={index} style={styles.menuItem}>
            <span style={styles.icon}>{item.icon}</span>
            {isOpen && <span style={styles.label}>{item.label}</span>}
          </Link>
        ))}
      </div>

      {isOpen && (
        <>
          <div style={styles.divider} />
          <div style={styles.sectionTitle}>Explore</div>
          <div style={styles.section}>
            {exploreItems.map((item, index) => (
              <Link to={item.path} key={index} style={styles.menuItem}>
                <span style={styles.icon}>{item.icon}</span>
                <span style={styles.label}>{item.label}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};

const styles = {
  sidebar: {
    position: 'fixed',
    top: '56px',
    left: 0,
    bottom: 0,
    background: '#0f0f0f',
    overflowY: 'auto',
    transition: 'width 0.2s ease',
    zIndex: 999,
    paddingTop: '12px',
  },
  open: { width: '240px' },
  closed: { width: '72px' },
  section: { display: 'flex', flexDirection: 'column' },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '10px 16px',
    color: '#fff',
    borderRadius: '10px',
    margin: '2px 8px',
    transition: 'background 0.2s',
    fontSize: '14px',
  },
  icon: { fontSize: '20px', minWidth: '24px', textAlign: 'center' },
  label: { fontSize: '14px' },
  divider: { height: '1px', background: '#272727', margin: '12px 0' },
  sectionTitle: {
    padding: '8px 16px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
  },
};

export default Sidebar;