import { Request, Response, NextFunction } from 'express';
import { visitService } from '../services/visit.service.js';
import { telegramService } from '../services/telegram.service.js';

export const trackVisit = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const path = req.path;
  const userAgent = req.headers['user-agent'];
  const referrer = req.headers['referer'] as string | undefined;

  visitService.trackVisit({
    ip,
    path,
    userAgent,
    referrer
  }).then(async () => {
    const milestone = await visitService.checkMilestone();
    if (milestone) {
      await telegramService.sendVisitMilestone(milestone);
    }
  }).catch(err => {
    console.error('Error tracking visit:', err);
  });

  next();
};
