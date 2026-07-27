import { Router } from 'express';
import prisma from '@trustfundx/database';

export const adminUserRouter = Router();

adminUserRouter.get('/', async (req, res, next) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (pageNum - 1) * limitNum, take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, username: true, firstName: true, lastName: true, role: true, walletAddress: true, isEmailVerified: true, lastLoginAt: true, createdAt: true, _count: { select: { donations: true } } },
      }),
      prisma.user.count(),
    ]);
    res.json({ success: true, data: { users, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } } });
  } catch (error) { next(error); }
});
