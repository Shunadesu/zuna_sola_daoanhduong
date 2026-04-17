import { Router, Response } from 'express';
import { Amenity } from '../../models/index.js';
import { authMiddleware, AuthRequest } from '../../middleware/index.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const amenities = await Amenity.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: amenities });
  } catch (error) {
    console.error('Get all amenities error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, isActive, sortOrder } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: 'Name is required' });
      return;
    }

    const existing = await Amenity.findOne({ name });
    if (existing) {
      res.status(400).json({ success: false, message: 'Công viên này đã tồn tại' });
      return;
    }

    const amenity = await Amenity.create({
      name,
      images: [],
      description: description || '',
      isActive: isActive ?? true,
      sortOrder: sortOrder ?? 0
    });

    res.status(201).json({ success: true, data: amenity });
  } catch (error) {
    console.error('Create amenity error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, images, description, isActive, sortOrder } = req.body;

    const amenity = await Amenity.findByIdAndUpdate(
      id,
      { name, images, description, isActive, sortOrder },
      { new: true, runValidators: true }
    );

    if (!amenity) {
      res.status(404).json({ success: false, message: 'Amenity not found' });
      return;
    }

    res.json({ success: true, data: amenity });
  } catch (error) {
    console.error('Update amenity error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const amenity = await Amenity.findByIdAndDelete(id);

    if (!amenity) {
      res.status(404).json({ success: false, message: 'Amenity not found' });
      return;
    }

    res.json({ success: true, message: 'Amenity deleted successfully' });
  } catch (error) {
    console.error('Delete amenity error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export const amenityAdminRoutes = router;
