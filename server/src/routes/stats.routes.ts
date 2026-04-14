import { Router, Response } from 'express';
import { Banner, Quote, Visit } from '../models/index.js';
import { authMiddleware, AuthRequest } from '../middleware/index.js';
import { visitService } from '../services/index.js';

const router = Router();

// All stats routes are protected
router.use(authMiddleware);

router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const [bannerCount, quoteCount, totalVisits, todayVisits] = await Promise.all([
      Banner.countDocuments(),
      Quote.countDocuments(),
      visitService.getTotalVisits(),
      visitService.getTodayVisits()
    ]);

    res.json({
      success: true,
      data: {
        banners: bannerCount,
        quotes: quoteCount,
        totalVisits,
        todayVisits
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/daily', async (_req: AuthRequest, res: Response) => {
  try {
    const stats = await visitService.getDailyStats(7);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get daily stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/quote-status', async (_req: AuthRequest, res: Response) => {
  try {
    const statusCounts = await Quote.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const stats = [
      { name: 'Mới', value: statusCounts.find(s => s._id === 'new')?.count || 0, color: '#22c55e' },
      { name: 'Đã liên hệ', value: statusCounts.find(s => s._id === 'contacted')?.count || 0, color: '#f59e0b' },
      { name: 'Đã đóng', value: statusCounts.find(s => s._id === 'closed')?.count || 0, color: '#6b7280' }
    ];

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get quote status stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
