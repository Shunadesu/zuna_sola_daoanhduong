import { Router, Request, Response } from 'express';
import { SellerSettings } from '../models/index.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    let settings = await SellerSettings.findOne();
    if (!settings) {
      settings = await SellerSettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get SellerSettings error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
