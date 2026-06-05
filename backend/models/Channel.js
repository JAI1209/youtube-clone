import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  channelBanner: {
    type: String,
    default: 'https://via.placeholder.com/1280x350'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscribers: {
    type: Number,
    default: 0
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }]
}, { timestamps: true });

export default mongoose.model('Channel', channelSchema);