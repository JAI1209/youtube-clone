import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return setError('Please fill all fields');
    try {
      setLoading(true);
      const { data } = await axios.post('/auth/login', formData);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yt-auth-page">
      <div className="yt-auth-box">
        <div className="yt-auth-logo">
          <span style={{ color: '#ff0000' }}>▶</span> YouTube
        </div>
        <div className="yt-auth-title">Sign In</div>
        {error && <div className="yt-auth-error">{error}</div>}
        <form className="yt-auth-form" onSubmit={handleSubmit}>
          <input className="yt-auth-input" type="email"    name="email"    placeholder="Email"    value={formData.email}    onChange={handleChange} />
          <input className="yt-auth-input" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <button className="yt-auth-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div className="yt-auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
