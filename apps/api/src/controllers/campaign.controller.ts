import { Request, Response, NextFunction } from 'express';
import prisma from '@trustfundx/database';
import { AppError } from '../middleware/errorHandler.middleware';

export const campaignController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        page = '1',
        limit = '12',
        disasterType,
        country,
        status = 'ACTIVE',
        search,
        sort = 'createdAt',
        order = 'desc',
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = { isPublished: true };
      if (status) where.status = status;
      if (disasterType) where.disasterType = disasterType;
      if (country) where.country = { contains: country as string, mode: 'insensitive' };
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
          { country: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const [campaigns, total] = await Promise.all([
        prisma.campaign.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { [sort as string]: order },
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
        prisma.campaign.count({ where }),
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
    } catch (error) {
      next(error);
    }
  },

  async getFeatured(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaigns = await prisma.campaign.findMany({
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
    } catch (error) {
      next(error);
    }
  },

  async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [totalCampaigns, activeCampaigns, totalDonations, totalDonors] = await Promise.all([
        prisma.campaign.count({ where: { isPublished: true } }),
        prisma.campaign.count({ where: { status: 'ACTIVE', isPublished: true } }),
        prisma.donation.aggregate({ where: { status: 'CONFIRMED' }, _sum: { amount: true } }),
        prisma.donation.groupBy({ by: ['donorWallet'], where: { status: 'CONFIRMED' } }),
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
    } catch (error) {
      next(error);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idOrSlug = req.params.idOrSlug as string;
      const campaign = await prisma.campaign.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
          isPublished: true,
        },
        include: {
          aiAnalysis: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      });
      if (!campaign) throw new AppError('Campaign not found', 404);
      res.json({ success: true, data: { campaign } });
    } catch (error) {
      next(error);
    }
  },

  async getDonations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      const [donations, total] = await Promise.all([
        prisma.donation.findMany({
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
        prisma.donation.count({ where: { campaignId: id, status: 'CONFIRMED' } }),
      ]);

      res.json({
        success: true,
        data: {
          donations,
          pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
