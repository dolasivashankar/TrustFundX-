"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignRouter = void 0;
const express_1 = require("express");
const campaign_controller_1 = require("../controllers/campaign.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.campaignRouter = (0, express_1.Router)();
exports.campaignRouter.get('/', auth_middleware_1.optionalAuth, campaign_controller_1.campaignController.getAll);
exports.campaignRouter.get('/featured', campaign_controller_1.campaignController.getFeatured);
exports.campaignRouter.get('/stats', campaign_controller_1.campaignController.getStats);
exports.campaignRouter.get('/:idOrSlug', auth_middleware_1.optionalAuth, campaign_controller_1.campaignController.getOne);
exports.campaignRouter.get('/:id/donations', campaign_controller_1.campaignController.getDonations);
//# sourceMappingURL=campaigns.routes.js.map