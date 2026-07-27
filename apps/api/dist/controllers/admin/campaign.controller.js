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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCampaignController = void 0;
const slugify_1 = __importDefault(require("slugify"));
const database_1 = __importDefault(require("@trustfundx/database"));
const errorHandler_middleware_1 = require("../../middleware/errorHandler.middleware");
const ai_service_1 = require("../../services/ai.service");
const logger_1 = require("../../utils/logger");
const uploadToCloudinary = async (file, folder) => {
    const { v2: cloudinary } = await Promise.resolve().then(() => __importStar(require('cloudinary')));
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
        stream.write(file.buffer);
        stream.end();
    });
    return result.secure_url;
};
exports.adminCampaignController = {
    async getAll(req, res, next) {
        try {
            const { page = '1', limit = '20', status, search } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const where = {};
            if (status)
                where.status = status;
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { country: { contains: search, mode: 'insensitive' } },
                ];
            }
            const [campaigns, total] = await Promise.all([
                database_1.default.campaign.findMany({
                    where, skip: (pageNum - 1) * limitNum, take: limitNum,
                    orderBy: { createdAt: 'desc' },
                    include: { _count: { select: { donations: true } }, aiAnalysis: { orderBy: { createdAt: 'desc' }, take: 1 } },
                }),
                database_1.default.campaign.count({ where }),
            ]);
            res.json({ success: true, data: { campaigns, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } } });
        }
        catch (error) {
            next(error);
        }
    },
    async getOne(req, res, next) {
        try {
            const id = req.params.id;
            const campaign = await database_1.default.campaign.findUnique({
                where: { id },
                include: { donations: { orderBy: { createdAt: 'desc' }, take: 10 }, aiAnalysis: { orderBy: { createdAt: 'desc' }, take: 1 }, _count: { select: { donations: true } } },
            });
            if (!campaign)
                throw new errorHandler_middleware_1.AppError('Campaign not found', 404);
            res.json({ success: true, data: { campaign } });
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const { name, description, shortDescription, disasterType, country, state, city, latitude, longitude, goalAmount, beneficiaryWallet, aiCategory, priority, expiryDate, isPublished, } = req.body;
            if (!name || !description || !disasterType || !country || !goalAmount || !beneficiaryWallet || !expiryDate) {
                throw new errorHandler_middleware_1.AppError('Required fields missing', 400);
            }
            const files = req.files;
            let bannerImage = req.body.bannerImageUrl || '';
            const galleryImages = [];
            if (files?.bannerImage?.[0]) {
                bannerImage = await uploadToCloudinary(files.bannerImage[0], 'trustfundx/banners');
            }
            if (files?.galleryImages) {
                for (const file of files.galleryImages) {
                    const url = await uploadToCloudinary(file, 'trustfundx/gallery');
                    galleryImages.push(url);
                }
            }
            const slug = (0, slugify_1.default)(`${name}-${Date.now()}`, { lower: true, strict: true });
            const campaign = await database_1.default.campaign.create({
                data: {
                    name, slug, description, shortDescription,
                    disasterType, country, state, city,
                    latitude: latitude ? parseFloat(latitude) : null,
                    longitude: longitude ? parseFloat(longitude) : null,
                    bannerImage: bannerImage || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200',
                    galleryImages,
                    goalAmount: parseFloat(goalAmount),
                    beneficiaryWallet,
                    aiCategory,
                    priority: parseInt(priority || '0'),
                    expiryDate: new Date(expiryDate),
                    status: isPublished === 'true' ? 'ACTIVE' : 'DRAFT',
                    isPublished: isPublished === 'true',
                    publishedAt: isPublished === 'true' ? new Date() : null,
                },
            });
            // Trigger AI verification in background
            setImmediate(async () => {
                try {
                    await ai_service_1.aiService.analyzeAndVerifyCampaign(campaign.id);
                }
                catch (err) {
                    logger_1.logger.error('AI verification failed for campaign:', campaign.id, err);
                }
            });
            res.status(201).json({ success: true, data: { campaign } });
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const id = req.params.id;
            const existing = await database_1.default.campaign.findUnique({ where: { id } });
            if (!existing)
                throw new errorHandler_middleware_1.AppError('Campaign not found', 404);
            const files = req.files;
            let bannerImage = req.body.bannerImageUrl || existing.bannerImage;
            if (files?.bannerImage?.[0]) {
                bannerImage = await uploadToCloudinary(files.bannerImage[0], 'trustfundx/banners');
            }
            const updateData = { ...req.body, bannerImage };
            delete updateData.bannerImageUrl;
            if (req.body.goalAmount)
                updateData.goalAmount = parseFloat(req.body.goalAmount);
            if (req.body.latitude)
                updateData.latitude = parseFloat(req.body.latitude);
            if (req.body.longitude)
                updateData.longitude = parseFloat(req.body.longitude);
            if (req.body.priority)
                updateData.priority = parseInt(req.body.priority);
            if (req.body.expiryDate)
                updateData.expiryDate = new Date(req.body.expiryDate);
            const campaign = await database_1.default.campaign.update({ where: { id }, data: updateData });
            res.json({ success: true, data: { campaign } });
        }
        catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            const id = req.params.id;
            await database_1.default.campaign.update({ where: { id }, data: { status: 'ARCHIVED', isPublished: false } });
            res.json({ success: true, message: 'Campaign archived successfully' });
        }
        catch (error) {
            next(error);
        }
    },
    async updateStatus(req, res, next) {
        try {
            const id = req.params.id;
            const { status, isPublished } = req.body;
            const updateData = {};
            if (status)
                updateData.status = status;
            if (typeof isPublished === 'boolean') {
                updateData.isPublished = isPublished;
                if (isPublished)
                    updateData.publishedAt = new Date();
            }
            const campaign = await database_1.default.campaign.update({ where: { id }, data: updateData });
            res.json({ success: true, data: { campaign } });
        }
        catch (error) {
            next(error);
        }
    },
    async triggerAiVerification(req, res, next) {
        try {
            const id = req.params.id;
            const analysis = await ai_service_1.aiService.analyzeAndVerifyCampaign(id);
            res.json({ success: true, data: { analysis } });
        }
        catch (error) {
            next(error);
        }
    },
    async exportData(req, res, next) {
        try {
            const id = req.params.id;
            const campaign = await database_1.default.campaign.findUnique({
                where: { id },
                include: { donations: { where: { status: 'CONFIRMED' }, orderBy: { createdAt: 'desc' } }, aiAnalysis: true },
            });
            if (!campaign)
                throw new errorHandler_middleware_1.AppError('Campaign not found', 404);
            const csvRows = ['Date,Donor Wallet,Amount (ALGO),TX ID,Explorer URL,x402 Verified'];
            for (const d of campaign.donations) {
                csvRows.push(`${d.createdAt.toISOString()},${d.isAnonymous ? 'Anonymous' : d.donorWallet},${d.amount},${d.algorandTxId || ''},${d.explorerUrl || ''},${d.x402Verified}`);
            }
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="campaign-${campaign.id}-donations.csv"`);
            res.send(csvRows.join('\n'));
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=campaign.controller.js.map