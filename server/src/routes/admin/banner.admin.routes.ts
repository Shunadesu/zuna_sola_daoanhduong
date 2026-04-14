import { Router, Response } from 'express';
import { Banner } from '../models/index.js';
import { authMiddleware, AuthRequest } from '../middleware/index.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all banners (including inactive)
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const banners = await Banner.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    console.error('Get all banners error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create new banner
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, subtitle, imageUrl, linkUrl, isActive, sortOrder } = req.body;

    if (!title || !imageUrl) {
      res.status(400).json({ success: false, message: 'Title and imageUrl are required' });
      return;
    }

    const banner = await Banner.create({
      title,
      subtitle: subtitle || '',
      imageUrl,
      linkUrl: linkUrl || '',
      isActive: isActive ?? true,
      sortOrder: sortOrder ?? 0
    });

    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update banner
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subtitle, imageUrl, linkUrl, isActive, sortOrder } = req.body;

    const banner = await Banner.findByIdAndUpdate(
      id,
      { title, subtitle, imageUrl, linkUrl, isActive, sortOrder },
      { new: true, runValidators: true }
    );

    if (!banner) {
      res.status(404).json({ success: false, message: 'Banner not found' });
      return;
    }

    res.json({ success: true, data: banner });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete banner
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      res.status(404).json({ success: false, message: 'Banner not found' });
      return;
    }

    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
