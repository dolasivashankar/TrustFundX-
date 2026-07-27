import { Router } from 'express';
import prisma from '@trustfundx/database';

export const adminDonationRouter = Router();

adminDonationRouter.get('/', async (req, res, next) => {
  try {
    const { page = '1', limit = '20', status, campaignId } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const where: any = {};
    if (status) where.status = status;
    if (campaignId) where.campaignId = campaignId;

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: { campaign: { select: { name: true, disasterType: true } } },
      }),
      prisma.donation.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        donations,
        pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
      },
    });
  } catch (error) { next(error); }
});

adminDonationRouter.get('/:id', async (req, res, next) => {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: req.params.id },
      include: { campaign: true, transaction: true },
    });
    if (!donation) { res.status(404).json({ success: false, error: 'Donation not found' }); return; }
    res.json({ success: true, data: { donation } });
  } catch (error) { next(error); }
});
