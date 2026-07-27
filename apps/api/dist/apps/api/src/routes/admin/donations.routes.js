"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDonationRouter = void 0;
const express_1 = require("express");
const database_1 = __importDefault(require("@trustfundx/database"));
exports.adminDonationRouter = (0, express_1.Router)();
exports.adminDonationRouter.get('/', async (req, res, next) => {
    try {
        const { page = '1', limit = '20', status, campaignId } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const where = {};
        if (status)
            where.status = status;
        if (campaignId)
            where.campaignId = campaignId;
        const [donations, total] = await Promise.all([
            database_1.default.donation.findMany({
                where,
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
                orderBy: { createdAt: 'desc' },
                include: { campaign: { select: { name: true, disasterType: true } } },
            }),
            database_1.default.donation.count({ where }),
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
});
exports.adminDonationRouter.get('/:id', async (req, res, next) => {
    try {
        const donation = await database_1.default.donation.findUnique({
            where: { id: req.params.id },
            include: { campaign: true, transaction: true },
        });
        if (!donation) {
            res.status(404).json({ success: false, error: 'Donation not found' });
            return;
        }
        res.json({ success: true, data: { donation } });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=donations.routes.js.map