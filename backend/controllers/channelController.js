import Channel from '../models/Channel.js';
import User from '../models/User.js';

// Create channel
export const createChannel = async (req, res) => {
  try {
    const { channelName, description } = req.body;

    const channelExists = await Channel.findOne({ channelName });
    if (channelExists) {
      return res.status(400).json({ message: 'Channel name already taken' });
    }

    const channel = await Channel.create({
      channelName,
      description,
      owner: req.user._id
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: channel._id }
    });

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get channel by ID
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate({
        path: 'videos',
        populate: { path: 'uploader', select: 'username' }
      });

    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my channels
export const getMyChannels = async (req, res) => {
  try {
    const channels = await Channel.find({ owner: req.user._id })
      .populate('videos');
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update channel
export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await Channel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete channel
export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await channel.deleteOne();
    res.json({ message: 'Channel deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};