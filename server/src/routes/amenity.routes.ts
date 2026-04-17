import { Router, Response } from 'express';
import { Amenity } from '../models/index.js';

const router = Router();

router.get('/', async (_req, res: Response) => {
  try {
    const amenities = await Amenity.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: amenities });
  } catch (error) {
    console.error('Get amenities error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
