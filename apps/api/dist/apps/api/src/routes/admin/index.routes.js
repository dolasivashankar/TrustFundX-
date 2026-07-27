"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const campaigns_routes_1 = require("./campaigns.routes");
const donations_routes_1 = require("./donations.routes");
const analytics_routes_1 = require("./analytics.routes");
const ai_routes_1 = require("./ai.routes");
const settings_routes_1 = require("./settings.routes");
const users_routes_1 = require("./users.routes");
exports.adminRouter = (0, express_1.Router)();
// All admin routes require authentication and admin role
exports.adminRouter.use(auth_middleware_1.authenticate, auth_middleware_1.requireAdmin);
exports.adminRouter.use('/campaigns', campaigns_routes_1.adminCampaignRouter);
exports.adminRouter.use('/donations', donations_routes_1.adminDonationRouter);
exports.adminRouter.use('/analytics', analytics_routes_1.adminAnalyticsRouter);
exports.adminRouter.use('/ai', ai_routes_1.adminAiRouter);
exports.adminRouter.use('/settings', settings_routes_1.adminSettingsRouter);
exports.adminRouter.use('/users', users_routes_1.adminUserRouter);
// Admin dashboard stats
exports.adminRouter.get('/stats', async (_req, res, next) => {
    try {
        const prisma = (await Promise.resolve().then(() => __importStar(require('@trustfundx/database')))).default;
        const [totalCampaigns, activeCampaigns, completedCampaigns, pendingCampaigns, totalDonations, totalDonors, fraudAlerts, todayDonations, monthlyDonations,] = await Promise.all([
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
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=index.routes.js.map