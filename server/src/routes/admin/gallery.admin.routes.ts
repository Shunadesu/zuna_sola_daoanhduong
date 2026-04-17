import { Router, Response } from 'express';
import { Gallery } from '../../models/index.js';
import { authMiddleware, AuthRequest } from '../../middleware/index.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const galleries = await Gallery.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: galleries });
  } catch (error) {
    console.error('Get all galleries error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, imageUrl, category, isActive, sortOrder } = req.body;

    if (!title || !imageUrl || !category) {
      res.status(400).json({ success: false, message: 'Title, imageUrl và category là bắt buộc' });
      return;
    }

    const validCategories = ['căn hộ', 'nội thất', 'tiện ích'];
    if (!validCategories.includes(category)) {
      res.status(400).json({ success: false, message: 'Category không hợp lệ' });
      return;
    }

    const gallery = await Gallery.create({
      title,
      imageUrl,
      category,
      isActive: isActive ?? true,
      sortOrder: sortOrder ?? 0
    });

    res.status(201).json({ success: true, data: gallery });
  } catch (error) {
    console.error('Create gallery error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, imageUrl, category, isActive, sortOrder } = req.body;

    if (category) {
      const validCategories = ['căn hộ', 'nội thất', 'tiện ích'];
      if (!validCategories.includes(category)) {
        res.status(400).json({ success: false, message: 'Category không hợp lệ' });
        return;
      }
    }

    const gallery = await Gallery.findByIdAndUpdate(
      id,
      { title, imageUrl, category, isActive, sortOrder },
      { new: true, runValidators: true }
    );

    if (!gallery) {
      res.status(404).json({ success: false, message: 'Gallery not found' });
      return;
    }

    res.json({ success: true, data: gallery });
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findByIdAndDelete(id);

    if (!gallery) {
      res.status(404).json({ success: false, message: 'Gallery not found' });
      return;
    }

    res.json({ success: true, message: 'Gallery deleted successfully' });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export const galleryAdminRoutes = router;
