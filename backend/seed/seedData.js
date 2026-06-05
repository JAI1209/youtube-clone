import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import Comment from '../models/Comment.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Video.deleteMany();
    await Channel.deleteMany();
    await Comment.deleteMany();

    // Create users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user1 = await User.create({
      username: 'JohnDoe',
      email: 'john@example.com',
      password: hashedPassword,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    });

    const user2 = await User.create({
      username: 'JaneDoe',
      email: 'jane@example.com',
      password: hashedPassword,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
    });

    // Create channels
    const channel1 = await Channel.create({
      channelName: 'Code with John',
      description: 'Coding tutorials and tech reviews',
      owner: user1._id,
      subscribers: 5200
    });

    const channel2 = await Channel.create({
      channelName: 'Jane Tech',
      description: 'Web development and design tutorials',
      owner: user2._id,
      subscribers: 3100
    });

    await User.findByIdAndUpdate(user1._id, { $push: { channels: channel1._id } });
    await User.findByIdAndUpdate(user2._id, { $push: { channels: channel2._id } });

    // Create videos
    const videos = await Video.insertMany([
      {
        title: 'Learn React in 30 Minutes',
        description: 'A quick tutorial to get started with React.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://img.youtube.com/vi/SqcY0GlETPk/maxresdefault.jpg',
        channelId: channel1._id,
        uploader: user1._id,
        category: 'React',
        views: 15200
      },
      {
        title: 'JavaScript ES6 Full Course',
        description: 'Complete JavaScript ES6 tutorial for beginners.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://img.youtube.com/vi/NCwa_xi0Uuc/maxresdefault.jpg',
        channelId: channel1._id,
        uploader: user1._id,
        category: 'JavaScript',
        views: 23400
      },
      {
        title: 'Node.js Crash Course',
        description: 'Learn Node.js from scratch in this crash course.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://img.youtube.com/vi/fBNz5xF-Kx4/maxresdefault.jpg',
        channelId: channel2._id,
        uploader: user2._id,
        category: 'Node.js',
        views: 18900
      },
      {
        title: 'Python for Beginners',
        description: 'Complete Python tutorial for absolute beginners.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://img.youtube.com/vi/kqtD5dpn9C8/maxresdefault.jpg',
        channelId: channel2._id,
        uploader: user2._id,
        category: 'Python',
        views: 31200
      },
      {
        title: 'Data Structures and Algorithms',
        description: 'Learn DSA with practical examples.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://img.youtube.com/vi/RBSGKlAvoiM/maxresdefault.jpg',
        channelId: channel1._id,
        uploader: user1._id,
        category: 'Data Structures',
        views: 9800
      },
      {
        title: 'Full Stack Web Development',
        description: 'Complete MERN stack tutorial.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://img.youtube.com/vi/7CqJlxBYj-M/maxresdefault.jpg',
        channelId: channel2._id,
        uploader: user2._id,
        category: 'Web Development',
        views: 42100
      },
      {
        title: 'CSS Grid and Flexbox',
        description: 'Master CSS layouts with Grid and Flexbox.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://img.youtube.com/vi/jV8B24rSN5o/maxresdefault.jpg',
        channelId: channel1._id,
        uploader: user1._id,
        category: 'Web Development',
        views: 12300
      },
      {
        title: 'Gaming Setup Tour 2024',
        description: 'My ultimate gaming setup tour.',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://img.youtube.com/vi/5qap5aO4i9A/maxresdefault.jpg',
        channelId: channel2._id,
        uploader: user2._id,
        category: 'Gaming',
        views: 7600
      }
    ]);

    // Add videos to channels
    await Channel.findByIdAndUpdate(channel1._id, {
      $push: { videos: { $each: videos.filter(v => v.channelId.toString() === channel1._id.toString()).map(v => v._id) } }
    });
    await Channel.findByIdAndUpdate(channel2._id, {
      $push: { videos: { $each: videos.filter(v => v.channelId.toString() === channel2._id.toString()).map(v => v._id) } }
    });

    // Create comments
    await Comment.create({
      videoId: videos[0]._id,
      userId: user2._id,
      text: 'Great video! Very helpful.'
    });

    await Comment.create({
      videoId: videos[0]._id,
      userId: user1._id,
      text: 'Thanks for watching!'
    });

    console.log('✅ Seed data inserted successfully!');
    console.log('👤 Test Login - Email: john@example.com | Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();