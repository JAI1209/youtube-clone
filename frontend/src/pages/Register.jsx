import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const validate = () => {
    if (!formData.username || !formData.email || !formData.password) return 'Please fill all fields';
    if (formData.username.length < 3)  return 'Username must be at least 3 characters';
    if (formData.password.length < 6)  return 'Password must be at least 6 characters';
    if (!formData.email.includes('@')) return 'Please enter a valid email';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    try {
      setLoading(true);
      await axios.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <div className="yt-auth-title">Create Account</div>
        {error && <div className="yt-auth-error">{error}</div>}
        <form className="yt-auth-form" onSubmit={handleSubmit}>
          <input className="yt-auth-input" type="text"     name="username" placeholder="Username (min 3 chars)" value={formData.username} onChange={handleChange} />
          <input className="yt-auth-input" type="email"    name="email"    placeholder="Email"                  value={formData.email}    onChange={handleChange} />
          <input className="yt-auth-input" type="password" name="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} />
          <button className="yt-auth-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <div className="yt-auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
