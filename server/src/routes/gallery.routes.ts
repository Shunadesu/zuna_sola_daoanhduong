import { Router, Response } from 'express';
import { Gallery } from '../models/index.js';

const router = Router();

router.get('/', async (req, res: Response) => {
  try {
    const { category } = req.query;
    const filter: Record<string, any> = { isActive: true };
    
    if (category && category !== 'all') {
      filter.category = category;
    }

    const galleries = await Gallery.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: galleries });
  } catch (error) {
    console.error('Get galleries error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
