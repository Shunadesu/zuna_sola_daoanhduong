import { Visit } from '../models/index.js';

interface TrackVisitData {
  ip: string;
  path: string;
  userAgent?: string;
  referrer?: string;
}

interface VisitStats {
  date: string;
  count: number;
  uniqueVisitors: number;
}

const VISIT_MILESTONES = [100, 500, 1000, 5000, 10000, 50000, 100000];
let lastMilestone = 0;

class VisitService {
  async trackVisit(data: TrackVisitData): Promise<void> {
    await Visit.create({
      ip: data.ip,
      path: data.path,
      userAgent: data.userAgent || '',
      referrer: data.referrer || ''
    });
  }

  async getTotalVisits(): Promise<number> {
    return Visit.countDocuments();
  }

  async getTodayVisits(): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return Visit.countDocuments({ createdAt: { $gte: startOfDay } });
  }

  async getDailyStats(days: number = 7): Promise<VisitStats[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const visits = await Visit.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          uniqueIps: { $addToSet: '$ip' }
        }
      },
      {
        $project: {
          date: '$_id',
          count: 1,
          uniqueVisitors: { $size: '$uniqueIps' }
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    const statsMap = new Map<string, VisitStats>();
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      statsMap.set(dateStr, { date: dateStr, count: 0, uniqueVisitors: 0 });
    }

    for (const stat of visits) {
      statsMap.set(stat.date, stat);
    }

    return Array.from(statsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  async checkMilestone(): Promise<number | null> {
    const total = await this.getTotalVisits();

    for (const milestone of VISIT_MILESTONES) {
      if (total >= milestone && lastMilestone < milestone) {
        lastMilestone = milestone;
        return milestone;
      }
    }

    return null;
  }
}

export const visitService = new VisitService();
export default visitService;
