import { Router, Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { upload, uploadDir } from '../middleware/upload.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

// Serve static files from uploads directory
const uploadsPath = path.resolve(uploadDir);
router.use('/uploads', express.static(uploadsPath));

// Upload single image
router.post('/upload', upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    // Build URL based on request
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    const imageUrl = `${baseUrl}/api/uploads/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        url: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// Upload multiple images
router.post('/upload-multiple', upload.array('images', 10), (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No files uploaded' });
      return;
    }

    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    const uploadedFiles = files.map((file) => ({
      url: `${baseUrl}/api/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      success: true,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// Error handling for multer errors
router.use((err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
  if (err.message.includes('only accept image files')) {
    res.status(400).json({ success: false, message: err.message });
    return;
  }
  if (err.message.includes('File too large')) {
    res.status(400).json({ success: false, message: 'File quá lớn (tối đa 5MB)' });
    return;
  }
  res.status(500).json({ success: false, message: 'Upload error' });
});

export default router;
