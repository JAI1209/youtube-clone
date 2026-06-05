import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setError('Please fill all fields');
    }
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
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.logo}>
          <span style={styles.logoRed}>▶</span> YouTube
        </div>
        <h2 style={styles.title}>Sign In</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f0f0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    background: '#212121',
    padding: '40px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #303030',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '24px',
  },
  logoRed: { color: '#ff0000' },
  title: {
    fontSize: '24px',
    color: '#fff',
    marginBottom: '24px',
    textAlign: 'center',
  },
  error: {
    background: '#ff000022',
    border: '1px solid #ff0000',
    color: '#ff6666',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #303030',
    background: '#121212',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
  },
  btn: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#ff0000',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },
  switchText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
  },
  link: { color: '#3ea6ff' },
};

export default Login;