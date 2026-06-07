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
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-[#0f0f0f] border-b border-[#272727]">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="text-white text-xl p-2 rounded-full hover:bg-[#272727]">
          ☰
        </button>
        <Link to="/" className="flex items-center gap-1 text-xl font-bold text-white">
          <img src="/YT-logo-B.png" alt="YouTube" className="h-6" />
        </Link>
      </div>

      {/* Center - Search */}
      <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-xl mx-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-l-full border border-[#303030] bg-[#121212] text-white text-base outline-none"
        />
        <button type="submit" className="px-4 py-2 rounded-r-full border border-[#303030] bg-[#222] text-white hover:bg-[#333]">
          🔍
        </button>
      </form>

      {/* Right */}
      <div className="flex items-center">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-white text-sm hidden md:block">Hi, {user.username}</span>
            <div className="relative">
              <img
                src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt="avatar"
                className="w-9 h-9 rounded-full cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
                <div className="absolute right-0 top-11 bg-[#212121] border border-[#303030] rounded-lg overflow-hidden z-50 min-w-[150px]">
                  <Link
                    to="/channel/my"
                    className="block px-4 py-2 text-white hover:bg-[#303030] text-sm border-b border-[#303030]"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Channel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-white hover:bg-[#303030] text-sm text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link to="/login" className="flex items-center gap-2 px-4 py-2 border border-[#3ea6ff] rounded-full text-[#3ea6ff] text-sm hover:bg-[#263850]">
            👤 Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;