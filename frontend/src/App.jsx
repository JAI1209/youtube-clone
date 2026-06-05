import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoPlayer from './pages/VideoPlayer';
import ChannelPage from './pages/ChannelPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/channel/:id" element={<ChannelPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;