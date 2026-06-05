import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: 'https://www.gravatar.com/avatar/?d=mp'
  },
  channels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);