import { Request, Response, NextFunction } from 'express';
import prisma from '@trustfundx/database';
import { aiService } from '../../services/ai.service';

export const aiAdminController = {
  async getAlerts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { resolved = 'false' } = req.query;
      const alerts = await prisma.aiAlert.findMany({
        where: { resolved: resolved === 'true' },
        orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
        take: 100,
      });
      res.json({ success: true, data: { alerts } });
    } catch (error) { next(error); }
  },

  async getAnalyses(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analyses = await prisma.aiAnalysis.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { campaign: { select: { name: true, disasterType: true } } },
      });
      res.json({ success: true, data: { analyses } });
    } catch (error) { next(error); }
  },

  async resolveAlert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const alert = await prisma.aiAlert.update({
        where: { id: req.params.id as string },
        data: { resolved: true, resolvedBy: req.user?.userId, resolvedAt: new Date() },
      });
      res.json({ success: true, data: { alert } });
    } catch (error) { next(error); }
  },

  async analyzeOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaignId = req.params.campaignId as string;
      const analysis = await aiService.analyzeAndVerifyCampaign(campaignId);
      res.json({ success: true, data: { analysis } });
    } catch (error) { next(error); }
  },

  async analyzeAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaigns = await prisma.campaign.findMany({ where: { aiVerificationStatus: 'PENDING' }, select: { id: true } });
      const results: any[] = [];
      for (const c of campaigns) {
        try {
          const result = await aiService.analyzeAndVerifyCampaign(c.id);
          results.push({ campaignId: c.id, status: 'success', result });
        } catch (err) {
          results.push({ campaignId: c.id, status: 'error', error: String(err) });
        }
      }
      res.json({ success: true, data: { processed: results.length, results } });
    } catch (error) { next(error); }
  },
};
