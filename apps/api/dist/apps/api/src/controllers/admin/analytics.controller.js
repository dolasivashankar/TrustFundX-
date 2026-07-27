"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAnalyticsController = void 0;
const database_1 = __importDefault(require("@trustfundx/database"));
exports.adminAnalyticsController = {
    async getDailyDonations(req, res, next) {
        try {
            const { days = '30' } = req.query;
            const daysNum = parseInt(days);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - daysNum);
            const donations = await database_1.default.donation.findMany({
                where: { status: 'CONFIRMED', createdAt: { gte: startDate } },
                select: { amount: true, createdAt: true },
            });
            const grouped = {};
            for (const d of donations) {
                const dateStr = d.createdAt.toISOString().split('T')[0];
                if (!grouped[dateStr])
                    grouped[dateStr] = { amount: 0, count: 0 };
                grouped[dateStr].amount += d.amount;
                grouped[dateStr].count += 1;
            }
            const result = Object.entries(grouped).map(([date, data]) => ({ date, amount: data.amount, count: data.count }));
            res.json({ success: true, data: { dailyDonations: result } });
        }
        catch (error) {
            next(error);
        }
    },
    async getMonthlyDonations(_req, res, next) {
        try {
            const donations = await database_1.default.donation.findMany({
                where: { status: 'CONFIRMED' },
                select: { amount: true, createdAt: true },
            });
            const grouped = {};
            for (const d of donations) {
                const monthStr = `${d.createdAt.getFullYear()}-${String(d.createdAt.getMonth() + 1).padStart(2, '0')}`;
                grouped[monthStr] = (grouped[monthStr] || 0) + d.amount;
            }
            const result = Object.entries(grouped).map(([month, amount]) => ({ month, amount }));
            res.json({ success: true, data: { monthlyDonations: result } });
        }
        catch (error) {
            next(error);
        }
    },
    async getCountryWise(_req, res, next) {
        try {
            const campaigns = await database_1.default.campaign.findMany({
                select: { country: true, raisedAmount: true, _count: { select: { donations: true } } },
            });
            const grouped = {};
            for (const c of campaigns) {
                if (!grouped[c.country])
                    grouped[c.country] = { raised: 0, count: 0 };
                grouped[c.country].raised += c.raisedAmount;
                grouped[c.country].count += c._count.donations;
            }
            const result = Object.entries(grouped).map(([country, data]) => ({ country, raised: data.raised, count: data.count }));
            res.json({ success: true, data: { countryWise: result } });
        }
        catch (error) {
            next(error);
        }
    },
    async getDisasterCategories(_req, res, next) {
        try {
            const campaigns = await database_1.default.campaign.findMany({
                select: { disasterType: true, raisedAmount: true },
            });
            const grouped = {};
            for (const c of campaigns) {
                if (!grouped[c.disasterType])
                    grouped[c.disasterType] = { count: 0, raised: 0 };
                grouped[c.disasterType].count += 1;
                grouped[c.disasterType].raised += c.raisedAmount;
            }
            const result = Object.entries(grouped).map(([disasterType, data]) => ({ disasterType, count: data.count, raised: data.raised }));
            res.json({ success: true, data: { categories: result } });
        }
        catch (error) {
            next(error);
        }
    },
    async getCampaignSuccessRate(_req, res, next) {
        try {
            const [total, completed, active] = await Promise.all([
                database_1.default.campaign.count(),
                database_1.default.campaign.count({ where: { status: 'COMPLETED' } }),
                database_1.default.campaign.count({ where: { status: 'ACTIVE' } }),
            ]);
            res.json({
                success: true,
                data: { total, completed, active, successRate: total > 0 ? (completed / total) * 100 : 0 },
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getDonationTrends(_req, res, next) {
        try {
            const recentDonations = await database_1.default.donation.findMany({
                where: { status: 'CONFIRMED' },
                orderBy: { createdAt: 'desc' },
                take: 30,
                select: { amount: true, createdAt: true, campaign: { select: { name: true } } },
            });
            res.json({ success: true, data: { trends: recentDonations } });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=analytics.controller.js.map