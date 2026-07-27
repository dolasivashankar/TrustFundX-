"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiAdminController = void 0;
const database_1 = __importDefault(require("@trustfundx/database"));
const ai_service_1 = require("../../services/ai.service");
exports.aiAdminController = {
    async getAlerts(req, res, next) {
        try {
            const { resolved = 'false' } = req.query;
            const alerts = await database_1.default.aiAlert.findMany({
                where: { resolved: resolved === 'true' },
                orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
                take: 100,
            });
            res.json({ success: true, data: { alerts } });
        }
        catch (error) {
            next(error);
        }
    },
    async getAnalyses(_req, res, next) {
        try {
            const analyses = await database_1.default.aiAnalysis.findMany({
                orderBy: { createdAt: 'desc' },
                take: 50,
                include: { campaign: { select: { name: true, disasterType: true } } },
            });
            res.json({ success: true, data: { analyses } });
        }
        catch (error) {
            next(error);
        }
    },
    async resolveAlert(req, res, next) {
        try {
            const alert = await database_1.default.aiAlert.update({
                where: { id: req.params.id },
                data: { resolved: true, resolvedBy: req.user?.userId, resolvedAt: new Date() },
            });
            res.json({ success: true, data: { alert } });
        }
        catch (error) {
            next(error);
        }
    },
    async analyzeOne(req, res, next) {
        try {
            const campaignId = req.params.campaignId;
            const analysis = await ai_service_1.aiService.analyzeAndVerifyCampaign(campaignId);
            res.json({ success: true, data: { analysis } });
        }
        catch (error) {
            next(error);
        }
    },
    async analyzeAll(_req, res, next) {
        try {
            const campaigns = await database_1.default.campaign.findMany({ where: { aiVerificationStatus: 'PENDING' }, select: { id: true } });
            const results = [];
            for (const c of campaigns) {
                try {
                    const result = await ai_service_1.aiService.analyzeAndVerifyCampaign(c.id);
                    results.push({ campaignId: c.id, status: 'success', result });
                }
                catch (err) {
                    results.push({ campaignId: c.id, status: 'error', error: String(err) });
                }
            }
            res.json({ success: true, data: { processed: results.length, results } });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=ai.controller.js.map