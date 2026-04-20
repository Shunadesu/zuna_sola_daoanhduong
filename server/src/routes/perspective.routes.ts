import { Router, Response } from 'express';
import { Perspective } from '../models/index.js';

const router = Router();

router.get('/', async (_req, res: Response) => {
  try {
    const perspectives = await Perspective.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .select('title imageUrl images linkUrl isActive sortOrder');
    res.json({ success: true, data: perspectives });
  } catch (error) {
    console.error('Get perspectives error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
