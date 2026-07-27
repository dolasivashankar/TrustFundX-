import { Router } from 'express';
import { adminAnalyticsController } from '../../controllers/admin/analytics.controller';

export const adminAnalyticsRouter = Router();

adminAnalyticsRouter.get('/daily-donations', adminAnalyticsController.getDailyDonations);
adminAnalyticsRouter.get('/monthly-donations', adminAnalyticsController.getMonthlyDonations);
adminAnalyticsRouter.get('/country-wise', adminAnalyticsController.getCountryWise);
adminAnalyticsRouter.get('/disaster-categories', adminAnalyticsController.getDisasterCategories);
adminAnalyticsRouter.get('/campaign-success', adminAnalyticsController.getCampaignSuccessRate);
adminAnalyticsRouter.get('/donation-trends', adminAnalyticsController.getDonationTrends);
