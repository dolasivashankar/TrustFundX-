import { Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import prisma from '@trustfundx/database';
import { AppError } from '../../middleware/errorHandler.middleware';
import { aiService } from '../../services/ai.service';
import { logger } from '../../utils/logger';

const uploadToCloudinary = async (file: Express.Multer.File, folder: string): Promise<string> => {
  const { v2: cloudinary } = await import('cloudinary');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.write(file.buffer);
    stream.end();
  });
  return result.secure_url;
};

export const adminCampaignController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = '1', limit = '20', status, search } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const where: any = {};
      if (status) where.status = status;
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { country: { contains: search as string, mode: 'insensitive' } },
        ];
      }
      const [campaigns, total] = await Promise.all([
        prisma.campaign.findMany({
          where, skip: (pageNum - 1) * limitNum, take: limitNum,
          orderBy: { createdAt: 'desc' },
          include: { _count: { select: { donations: true } }, aiAnalysis: { orderBy: { createdAt: 'desc' }, take: 1 } },
        }),
        prisma.campaign.count({ where }),
      ]);
      res.json({ success: true, data: { campaigns, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } } });
    } catch (error) { next(error); }
  },

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: { donations: { orderBy: { createdAt: 'desc' }, take: 10 }, aiAnalysis: { orderBy: { createdAt: 'desc' }, take: 1 }, _count: { select: { donations: true } } },
      });
      if (!campaign) throw new AppError('Campaign not found', 404);
      res.json({ success: true, data: { campaign } });
    } catch (error) { next(error); }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        name, description, shortDescription, disasterType, country, state, city,
        latitude, longitude, goalAmount, beneficiaryWallet, aiCategory,
        priority, expiryDate, isPublished,
      } = req.body;

      if (!name || !description || !disasterType || !country || !goalAmount || !beneficiaryWallet || !expiryDate) {
        throw new AppError('Required fields missing', 400);
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      let bannerImage = req.body.bannerImageUrl || '';
      const galleryImages: string[] = [];

      if (files?.bannerImage?.[0]) {
        bannerImage = await uploadToCloudinary(files.bannerImage[0], 'trustfundx/banners');
      }
      if (files?.galleryImages) {
        for (const file of files.galleryImages) {
          const url = await uploadToCloudinary(file, 'trustfundx/gallery');
          galleryImages.push(url);
        }
      }

      const slug = slugify(`${name}-${Date.now()}`, { lower: true, strict: true });

      const campaign = await prisma.campaign.create({
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
          await aiService.analyzeAndVerifyCampaign(campaign.id);
        } catch (err) {
          logger.error('AI verification failed for campaign:', campaign.id, err);
        }
      });

      res.status(201).json({ success: true, data: { campaign } });
    } catch (error) { next(error); }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const existing = await prisma.campaign.findUnique({ where: { id } });
      if (!existing) throw new AppError('Campaign not found', 404);

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      let bannerImage = req.body.bannerImageUrl || existing.bannerImage;

      if (files?.bannerImage?.[0]) {
        bannerImage = await uploadToCloudinary(files.bannerImage[0], 'trustfundx/banners');
      }

      const updateData: any = { ...req.body, bannerImage };
      delete updateData.bannerImageUrl;
      if (req.body.goalAmount) updateData.goalAmount = parseFloat(req.body.goalAmount);
      if (req.body.latitude) updateData.latitude = parseFloat(req.body.latitude);
      if (req.body.longitude) updateData.longitude = parseFloat(req.body.longitude);
      if (req.body.priority) updateData.priority = parseInt(req.body.priority);
      if (req.body.expiryDate) updateData.expiryDate = new Date(req.body.expiryDate);

      const campaign = await prisma.campaign.update({ where: { id }, data: updateData });
      res.json({ success: true, data: { campaign } });
    } catch (error) { next(error); }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await prisma.campaign.update({ where: { id }, data: { status: 'ARCHIVED', isPublished: false } });
      res.json({ success: true, message: 'Campaign archived successfully' });
    } catch (error) { next(error); }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status, isPublished } = req.body;
      const updateData: any = {};
      if (status) updateData.status = status;
      if (typeof isPublished === 'boolean') {
        updateData.isPublished = isPublished;
        if (isPublished) updateData.publishedAt = new Date();
      }
      const campaign = await prisma.campaign.update({ where: { id }, data: updateData });
      res.json({ success: true, data: { campaign } });
    } catch (error) { next(error); }
  },

  async triggerAiVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const analysis = await aiService.analyzeAndVerifyCampaign(id);
      res.json({ success: true, data: { analysis } });
    } catch (error) { next(error); }
  },

  async exportData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: { donations: { where: { status: 'CONFIRMED' }, orderBy: { createdAt: 'desc' } }, aiAnalysis: true },
      });
      if (!campaign) throw new AppError('Campaign not found', 404);

      const csvRows = ['Date,Donor Wallet,Amount (ALGO),TX ID,Explorer URL,x402 Verified'];
      for (const d of campaign.donations) {
        csvRows.push(`${d.createdAt.toISOString()},${d.isAnonymous ? 'Anonymous' : d.donorWallet},${d.amount},${d.algorandTxId || ''},${d.explorerUrl || ''},${d.x402Verified}`);
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="campaign-${campaign.id}-donations.csv"`);
      res.send(csvRows.join('\n'));
    } catch (error) { next(error); }
  },
};
