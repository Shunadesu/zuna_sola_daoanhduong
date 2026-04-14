import { Router, Response } from 'express';
import { Quote } from '../models/index.js';
import { telegramService } from '../services/index.js';

const router = Router();

// Public route - Submit quote
router.post('/', async (req, res: Response) => {
  try {
    const { fullName, phone, email, apartment, message } = req.body;

    if (!fullName || !phone) {
      res.status(400).json({ success: false, message: 'Full name and phone are required' });
      return;
    }

    const quote = await Quote.create({
      fullName,
      phone,
      email: email || '',
      apartment: apartment || '',
      message: message || ''
    });

    await telegramService.sendQuoteNotification({
      fullName,
      phone,
      email,
      apartment,
      message
    });

    res.status(201).json({ success: true, data: quote });
  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
