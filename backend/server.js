import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'YouTube Clone API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});