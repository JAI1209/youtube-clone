import Video from '../models/Video.js';
import Channel from '../models/Channel.js';

// Get all videos
export const getVideos = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const videos = await Video.find(query)
      .populate('channelId', 'channelName')
      .populate('uploader', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single video
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('channelId', 'channelName description')
      .populate('uploader', 'username avatar');

    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create video
export const createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, channelId, category } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      channelId,
      uploader: req.user._id,
      category
    });

    channel.videos.push(video._id);
    await channel.save();

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update video
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete video
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Channel.findByIdAndUpdate(video.channelId, {
      $pull: { videos: video._id }
    });

    await video.deleteOne();
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like video
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const alreadyLiked = video.likes.includes(req.user._id);
    const alreadyDisliked = video.dislikes.includes(req.user._id);

    if (alreadyLiked) {
      video.likes = video.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      video.likes.push(req.user._id);
      if (alreadyDisliked) {
        video.dislikes = video.dislikes.filter(id => id.toString() !== req.user._id.toString());
      }
    }

    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dislike video
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const alreadyDisliked = video.dislikes.includes(req.user._id);
    const alreadyLiked = video.likes.includes(req.user._id);

    if (alreadyDisliked) {
      video.dislikes = video.dislikes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      video.dislikes.push(req.user._id);
      if (alreadyLiked) {
        video.likes = video.likes.filter(id => id.toString() !== req.user._id.toString());
      }
    }

    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};