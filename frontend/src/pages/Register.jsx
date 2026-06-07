import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!formData.username || !formData.email || !formData.password) {
      return 'Please fill all fields';
    }
    if (formData.username.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (!formData.email.includes('@')) {
      return 'Please enter a valid email';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

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
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="bg-[#212121] p-10 rounded-xl w-full max-w-md border border-[#303030]">
        <div className="text-2xl font-bold text-white text-center mb-6">
          <span className="text-red-600">▶</span> YouTube
        </div>
        <h2 className="text-2xl text-white text-center mb-6">Create Account</h2>

        {error && (
          <div className="bg-red-900/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username (min 3 characters)"
            value={formData.username}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg border border-[#303030] bg-[#121212] text-white text-base outline-none focus:border-[#3ea6ff]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg border border-[#303030] bg-[#121212] text-white text-base outline-none focus:border-[#3ea6ff]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg border border-[#303030] bg-[#121212] text-white text-base outline-none focus:border-[#3ea6ff]"
          />
          <button
            type="submit"
            disabled={loading}
            className="py-3 rounded-lg bg-red-600 text-white text-base font-bold mt-2 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#3ea6ff] hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;