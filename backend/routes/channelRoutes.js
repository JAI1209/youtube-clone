import express from 'express';
import {
  createChannel,
  getChannelById,
  getMyChannels,
  updateChannel,
  deleteChannel
} from '../controllers/channelController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createChannel);
router.get('/my', protect, getMyChannels);
router.get('/:id', getChannelById);
router.put('/:id', protect, updateChannel);
router.delete('/:id', protect, deleteChannel);

export default router;