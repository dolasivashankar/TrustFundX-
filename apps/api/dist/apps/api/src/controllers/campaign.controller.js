"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignController = void 0;
const database_1 = __importDefault(require("@trustfundx/database"));
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
exports.campaignController = {
    async getAll(req, res, next) {
        try {
            const { page = '1', limit = '12', disasterType, country, status = 'ACTIVE', search, sort = 'createdAt', order = 'desc', } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const skip = (pageNum - 1) * limitNum;
            const where = { isPublished: true };
            if (status)
                where.status = status;
            if (disasterType)
                where.disasterType = disasterType;
            if (country)
                where.country = { contains: country, mode: 'insensitive' };
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { country: { contains: search, mode: 'insensitive' } },
                ];
            }
            const [campaigns, total] = await Promise.all([
                database_1.default.campaign.findMany({
                    where,
                    skip,
                    take: limitNum,
                    orderBy: { [sort]: order },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        shortDescription: true,
                        disasterType: true,
                        country: true,
                        state: true,
                        bannerImage: true,
                        goalAmount: true,
                        raisedAmount: true,
                        donorsCount: true,
                        status: true,
                        expiryDate: true,
                        aiVerified: true,
                        aiVerificationStatus: true,
                        aiRiskScore: true,
                        aiUrgencyScore: true,
                        isFeatured: true,
                        priority: true,
                        createdAt: true,
                    },
                }),
                database_1.default.campaign.count({ where }),
            ]);
            res.json({
                success: true,
                data: {
                    campaigns,
                    pagination: {
                        total,
                        page: pageNum,
                        limit: limitNum,
                        totalPages: Math.ceil(total / limitNum),
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getFeatured(_req, res, next) {
        try {
            const campaigns = await database_1.default.campaign.findMany({
                where: { isPublished: true, isFeatured: true, status: 'ACTIVE' },
                orderBy: { priority: 'asc' },
                take: 6,
                select: {
                    id: true, name: true, slug: true, shortDescription: true,
                    disasterType: true, country: true, bannerImage: true,
                    goalAmount: true, raisedAmount: true, donorsCount: true,
                    expiryDate: true, aiVerified: true, aiUrgencyScore: true,
                },
            });
            res.json({ success: true, data: { campaigns } });
        }
        catch (error) {
            next(error);
        }
    },
    async getStats(_req, res, next) {
        try {
            const [totalCampaigns, activeCampaigns, totalDonations, totalDonors] = await Promise.all([
                database_1.default.campaign.count({ where: { isPublished: true } }),
                database_1.default.campaign.count({ where: { status: 'ACTIVE', isPublished: true } }),
                database_1.default.donation.aggregate({ where: { status: 'CONFIRMED' }, _sum: { amount: true } }),
                database_1.default.donation.groupBy({ by: ['donorWallet'], where: { status: 'CONFIRMED' } }),
            ]);
            res.json({
                success: true,
                data: {
                    totalCampaigns,
                    activeCampaigns,
                    totalRaised: totalDonations._sum.amount || 0,
                    totalDonors: totalDonors.length,
                },
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getOne(req, res, next) {
        try {
            const idOrSlug = req.params.idOrSlug;
            const campaign = await database_1.default.campaign.findFirst({
                where: {
                    OR: [{ id: idOrSlug }, { slug: idOrSlug }],
                    isPublished: true,
                },
                include: {
                    aiAnalysis: { orderBy: { createdAt: 'desc' }, take: 1 },
                },
            });
            if (!campaign)
                throw new errorHandler_middleware_1.AppError('Campaign not found', 404);
            res.json({ success: true, data: { campaign } });
        }
        catch (error) {
            next(error);
        }
    },
    async getDonations(req, res, next) {
        try {
            const id = req.params.id;
            const { page = '1', limit = '20' } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const [donations, total] = await Promise.all([
                database_1.default.donation.findMany({
                    where: { campaignId: id, status: 'CONFIRMED' },
                    orderBy: { createdAt: 'desc' },
                    skip: (pageNum - 1) * limitNum,
                    take: limitNum,
                    select: {
                        id: true,
                        donorWallet: true,
                        amount: true,
                        algorandTxId: true,
                        explorerUrl: true,
                        x402Verified: true,
                        message: true,
                        isAnonymous: true,
                        createdAt: true,
                    },
                }),
                database_1.default.donation.count({ where: { campaignId: id, status: 'CONFIRMED' } }),
            ]);
            res.json({
                success: true,
                data: {
                    donations,
                    pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
                },
            });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=campaign.controller.js.map