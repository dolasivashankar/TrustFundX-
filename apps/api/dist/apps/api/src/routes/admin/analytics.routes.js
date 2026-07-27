"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAnalyticsRouter = void 0;
const express_1 = require("express");
const analytics_controller_1 = require("../../controllers/admin/analytics.controller");
exports.adminAnalyticsRouter = (0, express_1.Router)();
exports.adminAnalyticsRouter.get('/daily-donations', analytics_controller_1.adminAnalyticsController.getDailyDonations);
exports.adminAnalyticsRouter.get('/monthly-donations', analytics_controller_1.adminAnalyticsController.getMonthlyDonations);
exports.adminAnalyticsRouter.get('/country-wise', analytics_controller_1.adminAnalyticsController.getCountryWise);
exports.adminAnalyticsRouter.get('/disaster-categories', analytics_controller_1.adminAnalyticsController.getDisasterCategories);
exports.adminAnalyticsRouter.get('/campaign-success', analytics_controller_1.adminAnalyticsController.getCampaignSuccessRate);
exports.adminAnalyticsRouter.get('/donation-trends', analytics_controller_1.adminAnalyticsController.getDonationTrends);
//# sourceMappingURL=analytics.routes.js.map