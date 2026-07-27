"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAiRouter = void 0;
const express_1 = require("express");
const ai_controller_1 = require("../../controllers/admin/ai.controller");
exports.adminAiRouter = (0, express_1.Router)();
exports.adminAiRouter.get('/alerts', ai_controller_1.aiAdminController.getAlerts);
exports.adminAiRouter.get('/analyses', ai_controller_1.aiAdminController.getAnalyses);
exports.adminAiRouter.patch('/alerts/:id/resolve', ai_controller_1.aiAdminController.resolveAlert);
exports.adminAiRouter.post('/analyze/:campaignId', ai_controller_1.aiAdminController.analyzeOne);
exports.adminAiRouter.post('/analyze-all', ai_controller_1.aiAdminController.analyzeAll);
//# sourceMappingURL=ai.routes.js.map