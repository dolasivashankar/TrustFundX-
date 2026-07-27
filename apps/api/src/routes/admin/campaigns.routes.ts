import { Router } from 'express';
import { adminCampaignController } from '../../controllers/admin/campaign.controller';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export const adminCampaignRouter = Router();

adminCampaignRouter.get('/', adminCampaignController.getAll);
adminCampaignRouter.get('/:id', adminCampaignController.getOne);
adminCampaignRouter.post('/', upload.fields([{ name: 'bannerImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 10 }]), adminCampaignController.create);
adminCampaignRouter.put('/:id', upload.fields([{ name: 'bannerImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 10 }]), adminCampaignController.update);
adminCampaignRouter.delete('/:id', adminCampaignController.delete);
adminCampaignRouter.patch('/:id/status', adminCampaignController.updateStatus);
adminCampaignRouter.post('/:id/ai-verify', adminCampaignController.triggerAiVerification);
adminCampaignRouter.get('/:id/export', adminCampaignController.exportData);
