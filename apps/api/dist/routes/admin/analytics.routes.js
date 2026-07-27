"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAnalyticsRouter = void 0;
const express_1 = require("express");
const analytics_controller_1 = require("../../controllers/admin/analytics.controller");
exports.adminAnalyticsRouter = (0, express_1.Router)();
exports.adminAnalyticsRouter.get('/daily-donations', analytics_controller_1.analyticsController.dailyDonations);
exports.adminAnalyticsRouter.get('/monthly-donations', analytics_controller_1.analyticsController.monthlyDonations);
exports.adminAnalyticsRouter.get('/country-wise', analytics_controller_1.analyticsController.countryWise);
exports.adminAnalyticsRouter.get('/disaster-categories', analytics_controller_1.analyticsController.disasterCategories);
exports.adminAnalyticsRouter.get('/campaign-success', analytics_controller_1.analyticsController.campaignSuccess);
exports.adminAnalyticsRouter.get('/donation-trends', analytics_controller_1.analyticsController.donationTrends);
//# sourceMappingURL=analytics.routes.js.map