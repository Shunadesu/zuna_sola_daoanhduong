import { Router, Response } from 'express';
import { Quote } from '../../models/index.js';
import { authMiddleware, AuthRequest } from '../../middleware/index.js';

const router = Router();

router.use(authMiddleware);

// Get all quotes
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json({ success: true, data: quotes });
  } catch (error) {
    console.error('Get all quotes error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get quote stats
router.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const total = await Quote.countDocuments();
    const statusCounts = await Quote.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const stats = {
      total,
      new: statusCounts.find(s => s._id === 'new')?.count || 0,
      contacted: statusCounts.find(s => s._id === 'contacted')?.count || 0,
      closed: statusCounts.find(s => s._id === 'closed')?.count || 0
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get quote stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update quote status
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'contacted', 'closed'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    const quote = await Quote.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!quote) {
      res.status(404).json({ success: false, message: 'Quote not found' });
      return;
    }

    res.json({ success: true, data: quote });
  } catch (error) {
    console.error('Update quote error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
