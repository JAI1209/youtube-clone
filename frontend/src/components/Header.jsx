import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdSearch, MdAccountCircle, MdVideoLibrary, MdLogout } from 'react-icons/md';

const FALLBACK_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

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
    <header className="yt-header">
      {/* Left */}
      <div className="yt-header__left">
        <button className="yt-header__menu-btn" onClick={onMenuClick} aria-label="Menu">
          ☰
        </button>
        <Link to="/" className="yt-header__logo">
          <img
            src="/YT-logo-B.png"
            alt="YouTube"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
          <span style={{ display: 'none', alignItems: 'center', gap: '6px', color: '#fff', fontWeight: 700, fontSize: '18px' }}>
            <span style={{ color: '#ff0000' }}>▶</span> YouTube
          </span>
        </Link>
      </div>

      {/* Center */}
      <form className="yt-header__search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" aria-label="Search"><MdSearch size={22} /></button>
      </form>

      {/* Right */}
      <div className="yt-header__right" style={{ position: 'relative' }}>
        {user ? (
          <>
            <span className="yt-header__username">Hi, {user.username}</span>
            <img
              src={user.avatar || FALLBACK_AVATAR}
              alt="avatar"
              className="yt-header__avatar"
              onClick={() => setShowDropdown((v) => !v)}
              onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
            />
            {showDropdown && (
              <div className="yt-header__dropdown">
                <Link to="/channel/my" onClick={() => setShowDropdown(false)}>
                  <MdVideoLibrary size={18} /> My Channel
                </Link>
                <button onClick={handleLogout}>
                  <MdLogout size={18} /> Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <Link to="/login" className="yt-signin-btn">
            <MdAccountCircle size={20} /> Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
