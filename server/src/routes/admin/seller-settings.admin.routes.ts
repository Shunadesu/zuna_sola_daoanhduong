import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/index.js';
import { SellerSettings } from '../../models/index.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (_req: AuthRequest, res: Response) => {
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

router.put('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, title, phone, zalo, avatar, description, intro } = req.body;
    let settings = await SellerSettings.findOne();
    if (!settings) {
      settings = await SellerSettings.create({ name, title, phone, zalo, avatar, description, intro });
    } else {
      Object.assign(settings, { name, title, phone, zalo, avatar, description, intro });
      await settings.save();
    }
    res.json({ success: true, message: 'Đã lưu cấu hình', data: settings });
  } catch (error) {
    console.error('Update SellerSettings error:', error);
    res.status(500).json({ success: false, message: 'Không thể lưu cấu hình' });
  }
});

export const sellerSettingsAdminRoutes = router;
