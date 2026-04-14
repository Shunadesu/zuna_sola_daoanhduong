import { Router, Response } from 'express';
import { Contact } from '../models/index.js';
import { authMiddleware, AuthRequest } from '../middleware/index.js';

const router = Router();

router.use(authMiddleware);

// Get all contacts
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Get all contacts error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create contact
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { type, label, value, icon, isActive, sortOrder } = req.body;

    if (!type || !label || !value) {
      res.status(400).json({ success: false, message: 'Type, label and value are required' });
      return;
    }

    const validTypes = ['phone', 'whatsapp', 'zalo', 'facebook', 'quote'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ success: false, message: 'Invalid contact type' });
      return;
    }

    const contact = await Contact.create({
      type,
      label,
      value,
      icon: icon || '',
      isActive: isActive ?? true,
      sortOrder: sortOrder ?? 0
    });

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update contact
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { type, label, value, icon, isActive, sortOrder } = req.body;

    if (type) {
      const validTypes = ['phone', 'whatsapp', 'zalo', 'facebook', 'quote'];
      if (!validTypes.includes(type)) {
        res.status(400).json({ success: false, message: 'Invalid contact type' });
        return;
      }
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { type, label, value, icon, isActive, sortOrder },
      { new: true, runValidators: true }
    );

    if (!contact) {
      res.status(404).json({ success: false, message: 'Contact not found' });
      return;
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete contact
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      res.status(404).json({ success: false, message: 'Contact not found' });
      return;
    }

    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
