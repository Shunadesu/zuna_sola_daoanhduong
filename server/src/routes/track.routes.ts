import { Router, Request, Response } from 'express';
import { visitService } from '../services/index.js';

const router = Router();

router.post('/pageview', async (req: Request, res: Response) => {
  try {
    const { 
      page, 
      referrer 
    } = req.body;
    
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || '';

    await visitService.trackVisit({
      ip,
      path: page || '/',
      userAgent,
      referrer
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Track error:', error);
    res.status(500).json({ success: false });
  }
});

export default router;
