import { Router } from 'express';
import { campaignController } from '../controllers/campaign.controller';
import { optionalAuth } from '../middleware/auth.middleware';

export const campaignRouter = Router();

campaignRouter.get('/', optionalAuth, campaignController.getAll);
campaignRouter.get('/featured', campaignController.getFeatured);
campaignRouter.get('/stats', campaignController.getStats);
campaignRouter.get('/:idOrSlug', optionalAuth, campaignController.getOne);
campaignRouter.get('/:id/donations', campaignController.getDonations);
