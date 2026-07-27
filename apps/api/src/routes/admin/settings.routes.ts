import { Router } from 'express';
import prisma from '@trustfundx/database';
import bcrypt from 'bcrypt';
import { AppError } from '../../middleware/errorHandler.middleware';

export const adminSettingsRouter = Router();

adminSettingsRouter.get('/', async (req, res, next) => {
  try {
    let settings = await prisma.adminSettings.findFirst();
    if (!settings) {
      settings = await prisma.adminSettings.create({ data: {} });
    }
    // Remove sensitive fields
    const { geminiApiKey, ...safeSettings } = settings as any;
    res.json({ success: true, data: { settings: { ...safeSettings, hasGeminiKey: !!geminiApiKey } } });
  } catch (error) { next(error); }
});

adminSettingsRouter.put('/', async (req, res, next) => {
  try {
    const settings = await prisma.adminSettings.upsert({
      where: { id: '1' },
      update: req.body,
      create: { id: '1', ...req.body },
    });
    res.json({ success: true, data: { settings } });
  } catch (error) { next(error); }
});

adminSettingsRouter.post('/change-password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) throw new AppError('Both passwords required', 400);
    if (newPassword.length < 8) throw new AppError('New password must be at least 8 chars', 400);

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) throw new AppError('User not found', 404);

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) throw new AppError('Current password is incorrect', 400);

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) { next(error); }
});

adminSettingsRouter.get('/audit-logs', async (req, res, next) => {
  try {
    const { page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip: (pageNum - 1) * limitNum, take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, username: true } } },
      }),
      prisma.auditLog.count(),
    ]);
    res.json({ success: true, data: { logs, pagination: { total, page: pageNum, limit: limitNum } } });
  } catch (error) { next(error); }
});
