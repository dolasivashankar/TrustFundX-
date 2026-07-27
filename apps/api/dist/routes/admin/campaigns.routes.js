"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCampaignRouter = void 0;
const express_1 = require("express");
const campaign_controller_1 = require("../../controllers/admin/campaign.controller");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
exports.adminCampaignRouter = (0, express_1.Router)();
exports.adminCampaignRouter.get('/', campaign_controller_1.adminCampaignController.getAll);
exports.adminCampaignRouter.get('/:id', campaign_controller_1.adminCampaignController.getOne);
exports.adminCampaignRouter.post('/', upload.fields([{ name: 'bannerImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 10 }]), campaign_controller_1.adminCampaignController.create);
exports.adminCampaignRouter.put('/:id', upload.fields([{ name: 'bannerImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 10 }]), campaign_controller_1.adminCampaignController.update);
exports.adminCampaignRouter.delete('/:id', campaign_controller_1.adminCampaignController.delete);
exports.adminCampaignRouter.patch('/:id/status', campaign_controller_1.adminCampaignController.updateStatus);
exports.adminCampaignRouter.post('/:id/ai-verify', campaign_controller_1.adminCampaignController.triggerAiVerification);
exports.adminCampaignRouter.get('/:id/export', campaign_controller_1.adminCampaignController.exportData);
//# sourceMappingURL=campaigns.routes.js.map