import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware';
import { adminCampaignRouter } from './campaigns.routes';
import { adminDonationRouter } from './donations.routes';
import { adminAnalyticsRouter } from './analytics.routes';
import { adminAiRouter } from './ai.routes';
import { adminSettingsRouter } from './settings.routes';
import { adminUserRouter } from './users.routes';

export const adminRouter = Router();

// All admin routes require authentication and admin role
adminRouter.use(authenticate, requireAdmin);

adminRouter.use('/campaigns', adminCampaignRouter);
adminRouter.use('/donations', adminDonationRouter);
adminRouter.use('/analytics', adminAnalyticsRouter);
adminRouter.use('/ai', adminAiRouter);
adminRouter.use('/settings', adminSettingsRouter);
adminRouter.use('/users', adminUserRouter);

// Admin dashboard stats
adminRouter.get('/stats', async (_req, res, next) => {
  try {
    const prisma = (await import('@trustfundx/database')).default;
    const [
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      pendingCampaigns,
      totalDonations,
      totalDonors,
      fraudAlerts,
      todayDonations,
      monthlyDonations,
    ] = await Promise.all([
      prisma.campaign.count(),
      prisma.campaign.count({ where: { status: 'ACTIVE' } }),
      prisma.campaign.count({ where: { status: 'COMPLETED' } }),
      prisma.campaign.count({ where: { status: 'PENDING' } }),
      prisma.donation.aggregate({ where: { status: 'CONFIRMED' }, _sum: { amount: true }, _count: true }),
      prisma.donation.groupBy({ by: ['donorWallet'], where: { status: 'CONFIRMED' } }),
      prisma.aiAlert.count({ where: { resolved: false, severity: { in: ['HIGH', 'CRITICAL'] } } }),
      prisma.donation.aggregate({
        where: {
          status: 'CONFIRMED',
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.donation.aggregate({
        where: {
          status: 'CONFIRMED',
          createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalCampaigns,
        activeCampaigns,
        completedCampaigns,
        pendingCampaigns,
        totalRaised: totalDonations._sum.amount || 0,
        totalDonations: totalDonations._count,
        totalDonors: totalDonors.length,
        fraudAlerts,
        todayDonations: { count: todayDonations._count, amount: todayDonations._sum.amount || 0 },
        monthlyDonations: { count: monthlyDonations._count, amount: monthlyDonations._sum.amount || 0 },
      },
    });
  } catch (error) {
    next(error);
  }
});
