import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/index.js';
import { authMiddleware, AuthRequest } from '../middleware/index.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

router.post('/login', async (req, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ success: false, message: 'Username and password required' });
      return;
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { adminId: admin._id.toString(), username: admin.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        token,
        admin: { id: admin._id, username: admin.username }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/verify', authMiddleware, (_req: AuthRequest, res: Response) => {
  res.json({ success: true, message: 'Token is valid' });
});

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }
    res.json({ success: true, data: admin });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
