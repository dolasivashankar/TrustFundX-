import { Request, Response, NextFunction } from 'express';
import prisma from '@trustfundx/database';

export const adminAnalyticsController = {
  async getDailyDonations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { days = '30' } = req.query;
      const daysNum = parseInt(days as string);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const donations = await prisma.donation.findMany({
        where: { status: 'CONFIRMED', createdAt: { gte: startDate } },
        select: { amount: true, createdAt: true },
      });

      const grouped: { [date: string]: { amount: number; count: number } } = {};
      for (const d of donations) {
        const dateStr = d.createdAt.toISOString().split('T')[0];
        if (!grouped[dateStr]) grouped[dateStr] = { amount: 0, count: 0 };
        grouped[dateStr].amount += d.amount;
        grouped[dateStr].count += 1;
      }

      const result = Object.entries(grouped).map(([date, data]) => ({ date, amount: data.amount, count: data.count }));
      res.json({ success: true, data: { dailyDonations: result } });
    } catch (error) { next(error); }
  },

  async getMonthlyDonations(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const donations = await prisma.donation.findMany({
        where: { status: 'CONFIRMED' },
        select: { amount: true, createdAt: true },
      });

      const grouped: { [month: string]: number } = {};
      for (const d of donations) {
        const monthStr = `${d.createdAt.getFullYear()}-${String(d.createdAt.getMonth() + 1).padStart(2, '0')}`;
        grouped[monthStr] = (grouped[monthStr] || 0) + d.amount;
      }

      const result = Object.entries(grouped).map(([month, amount]) => ({ month, amount }));
      res.json({ success: true, data: { monthlyDonations: result } });
    } catch (error) { next(error); }
  },

  async getCountryWise(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaigns = await prisma.campaign.findMany({
        select: { country: true, raisedAmount: true, _count: { select: { donations: true } } },
      });

      const grouped: { [country: string]: { raised: number; count: number } } = {};
      for (const c of campaigns) {
        if (!grouped[c.country]) grouped[c.country] = { raised: 0, count: 0 };
        grouped[c.country].raised += c.raisedAmount;
        grouped[c.country].count += c._count.donations;
      }

      const result = Object.entries(grouped).map(([country, data]) => ({ country, raised: data.raised, count: data.count }));
      res.json({ success: true, data: { countryWise: result } });
    } catch (error) { next(error); }
  },

  async getDisasterCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaigns = await prisma.campaign.findMany({
        select: { disasterType: true, raisedAmount: true },
      });

      const grouped: { [type: string]: { count: number; raised: number } } = {};
      for (const c of campaigns) {
        if (!grouped[c.disasterType]) grouped[c.disasterType] = { count: 0, raised: 0 };
        grouped[c.disasterType].count += 1;
        grouped[c.disasterType].raised += c.raisedAmount;
      }

      const result = Object.entries(grouped).map(([disasterType, data]) => ({ disasterType, count: data.count, raised: data.raised }));
      res.json({ success: true, data: { categories: result } });
    } catch (error) { next(error); }
  },

  async getCampaignSuccessRate(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [total, completed, active] = await Promise.all([
        prisma.campaign.count(),
        prisma.campaign.count({ where: { status: 'COMPLETED' } }),
        prisma.campaign.count({ where: { status: 'ACTIVE' } }),
      ]);

      res.json({
        success: true,
        data: { total, completed, active, successRate: total > 0 ? (completed / total) * 100 : 0 },
      });
    } catch (error) { next(error); }
  },

  async getDonationTrends(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recentDonations = await prisma.donation.findMany({
        where: { status: 'CONFIRMED' },
        orderBy: { createdAt: 'desc' },
        take: 30,
        select: { amount: true, createdAt: true, campaign: { select: { name: true } } },
      });
      res.json({ success: true, data: { trends: recentDonations } });
    } catch (error) { next(error); }
  },
};
