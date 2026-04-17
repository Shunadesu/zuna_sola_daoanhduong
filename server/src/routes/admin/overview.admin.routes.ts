import { Router, Response } from 'express';
import { Overview } from '../../models/index.js';
import { authMiddleware, AuthRequest } from '../../middleware/index.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const overviews = await Overview.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: overviews });
  } catch (error) {
    console.error('Get all overviews error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, images, linkUrl, isActive, sortOrder } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: 'Title is required' });
      return;
    }

    const overview = await Overview.create({
      title,
      images: images || [],
      linkUrl: linkUrl || '',
      isActive: isActive ?? true,
      sortOrder: sortOrder ?? 0
    });

    res.status(201).json({ success: true, data: overview });
  } catch (error) {
    console.error('Create overview error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, images, linkUrl, isActive, sortOrder } = req.body;

    const overview = await Overview.findByIdAndUpdate(
      id,
      { title, images, linkUrl, isActive, sortOrder },
      { new: true, runValidators: true }
    );

    if (!overview) {
      res.status(404).json({ success: false, message: 'Overview not found' });
      return;
    }

    res.json({ success: true, data: overview });
  } catch (error) {
    console.error('Update overview error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const overview = await Overview.findByIdAndDelete(id);

    if (!overview) {
      res.status(404).json({ success: false, message: 'Overview not found' });
      return;
    }

    res.json({ success: true, message: 'Overview deleted successfully' });
  } catch (error) {
    console.error('Delete overview error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export const overviewAdminRoutes = router;
