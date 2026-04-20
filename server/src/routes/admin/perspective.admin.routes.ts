import { Router, Response } from 'express';
import { Perspective } from '../../models/index.js';
import { authMiddleware, AuthRequest } from '../../middleware/index.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const perspectives = await Perspective.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: perspectives });
  } catch (error) {
    console.error('Get all perspectives error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, imageUrl, images, linkUrl, isActive, sortOrder } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: 'Title is required' });
      return;
    }

    const perspective = await Perspective.create({
      title,
      imageUrl: imageUrl || '',
      images: images || [],
      linkUrl: linkUrl || '',
      isActive: isActive ?? true,
      sortOrder: sortOrder ?? 0
    });

    res.status(201).json({ success: true, data: perspective });
  } catch (error) {
    console.error('Create perspective error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, imageUrl, images, linkUrl, isActive, sortOrder } = req.body;

    const perspective = await Perspective.findByIdAndUpdate(
      id,
      { title, imageUrl, images, linkUrl, isActive, sortOrder },
      { new: true, runValidators: true }
    );

    if (!perspective) {
      res.status(404).json({ success: false, message: 'Perspective not found' });
      return;
    }

    res.json({ success: true, data: perspective });
  } catch (error) {
    console.error('Update perspective error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const perspective = await Perspective.findByIdAndDelete(id);

    if (!perspective) {
      res.status(404).json({ success: false, message: 'Perspective not found' });
      return;
    }

    res.json({ success: true, message: 'Perspective deleted successfully' });
  } catch (error) {
    console.error('Delete perspective error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export const perspectiveAdminRoutes = router;
