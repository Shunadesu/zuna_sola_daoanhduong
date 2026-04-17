import { Router, Response } from 'express';
import { Banner } from '../../models/index.js';
import { authMiddleware, AuthRequest } from '../../middleware/index.js';
import path from 'path';
import fs from 'fs';

const router = Router();

// Helper function to delete uploaded file
const deleteUploadedFile = (imageUrl: string) => {
  if (!imageUrl || !imageUrl.includes('/api/uploads/')) return;
  try {
    const filename = imageUrl.split('/api/uploads/')[1];
    if (!filename) return;
    // Handle full URL or relative path
    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
  } catch (error) {
    console.error('Error deleting uploaded file:', error);
  }
};

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

    // Get old banner to check if image changed
    const oldBanner = await Banner.findById(id);
    if (!oldBanner) {
      res.status(404).json({ success: false, message: 'Banner not found' });
      return;
    }

    const banner = await Banner.findByIdAndUpdate(
      id,
      { title, subtitle, imageUrl, linkUrl, isActive, sortOrder },
      { new: true, runValidators: true }
    );

    if (!banner) {
      res.status(404).json({ success: false, message: 'Banner not found' });
      return;
    }

    // Delete old image if it was changed and is a local upload
    if (oldBanner.imageUrl !== imageUrl) {
      deleteUploadedFile(oldBanner.imageUrl);
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

    // Delete the uploaded image file
    deleteUploadedFile(banner.imageUrl);

    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export const bannerAdminRoutes = router;
