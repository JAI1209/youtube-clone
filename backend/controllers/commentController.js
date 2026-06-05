import Comment from '../models/Comment.js';

// Get comments for a video
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = await Comment.create({
      videoId: req.params.videoId,
      userId: req.user._id,
      text
    });

    const populated = await comment.populate('userId', 'username avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit comment
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    comment.text = req.body.text;
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};