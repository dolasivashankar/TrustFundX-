import { Router } from 'express';
import { aiAdminController } from '../../controllers/admin/ai.controller';

export const adminAiRouter = Router();

adminAiRouter.get('/alerts', aiAdminController.getAlerts);
adminAiRouter.get('/analyses', aiAdminController.getAnalyses);
adminAiRouter.patch('/alerts/:id/resolve', aiAdminController.resolveAlert);
adminAiRouter.post('/analyze/:campaignId', aiAdminController.analyzeOne);
adminAiRouter.post('/analyze-all', aiAdminController.analyzeAll);
