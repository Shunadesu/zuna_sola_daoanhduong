import { Router, Response } from 'express';
import { Banner } from '../models/index.js';

const router = Router();

// Public routes - Get active banners only
router.get('/', async (_req, res: Response) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
