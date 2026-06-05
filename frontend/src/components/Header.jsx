import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ onMenuClick, onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <header style={styles.header}>
      {/* Left */}
      <div style={styles.left}>
        <button onClick={onMenuClick} style={styles.menuBtn}>☰</button>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoRed}>▶</span> YouTube
        </Link>
      </div>

      {/* Center - Search */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchBtn}>🔍</button>
      </form>

      {/* Right */}
      <div style={styles.right}>
        {user ? (
          <div style={styles.userSection}>
            <span style={styles.username}>Hi, {user.username}</span>
            <div style={styles.avatarContainer}>
              <img
                src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt="avatar"
                style={styles.avatar}
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
                <div style={styles.dropdown}>
                  <Link to={`/channel/my`} style={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                    My Channel
                  </Link>
                  <button onClick={handleLogout} style={styles.dropdownItem}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link to="/login" style={styles.signInBtn}>
            👤 Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    height: '56px',
    background: '#0f0f0f',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottom: '1px solid #272727',
  },
  left: { display: 'flex', alignItems: 'center', gap: '16px' },
  menuBtn: {
    background: 'none', border: 'none', color: '#fff',
    fontSize: '20px', padding: '8px', borderRadius: '50%',
    cursor: 'pointer',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '4px',
    fontSize: '20px', fontWeight: 'bold', color: '#fff',
  },
  logoRed: { color: '#ff0000', fontSize: '24px' },
  searchForm: { display: 'flex', alignItems: 'center', flex: 1, maxWidth: '600px', margin: '0 20px' },
  searchInput: {
    flex: 1, padding: '8px 16px', borderRadius: '20px 0 0 20px',
    border: '1px solid #303030', background: '#121212',
    color: '#fff', fontSize: '16px', outline: 'none',
  },
  searchBtn: {
    padding: '8px 16px', borderRadius: '0 20px 20px 0',
    border: '1px solid #303030', background: '#222',
    color: '#fff', fontSize: '16px', cursor: 'pointer',
  },
  right: { display: 'flex', alignItems: 'center' },
  userSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  username: { color: '#fff', fontSize: '14px' },
  avatarContainer: { position: 'relative' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' },
  dropdown: {
    position: 'absolute', right: 0, top: '45px',
    background: '#212121', border: '1px solid #303030',
    borderRadius: '8px', overflow: 'hidden', zIndex: 1001,
    minWidth: '150px',
  },
  dropdownItem: {
    display: 'block', padding: '10px 16px', color: '#fff',
    background: 'none', border: 'none', width: '100%',
    textAlign: 'left', cursor: 'pointer', fontSize: '14px',
    borderBottom: '1px solid #303030',
  },
  signInBtn: {
    padding: '8px 16px', border: '1px solid #3ea6ff',
    borderRadius: '20px', color: '#3ea6ff', fontSize: '14px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
};

export default Header;