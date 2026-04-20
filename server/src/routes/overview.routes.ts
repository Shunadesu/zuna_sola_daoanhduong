import { Router, Response } from 'express';
import { Overview } from '../models/index.js';

const router = Router();

// Public routes
router.get('/', async (_req, res: Response) => {
  try {
    const overviews = await Overview.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .select('title imageUrl images linkUrl isActive sortOrder');
    res.json({ success: true, data: overviews });
  } catch (error) {
    console.error('Get overviews error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
