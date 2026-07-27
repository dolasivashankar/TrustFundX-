"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSettingsRouter = void 0;
const express_1 = require("express");
const database_1 = __importDefault(require("@trustfundx/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const errorHandler_middleware_1 = require("../../middleware/errorHandler.middleware");
exports.adminSettingsRouter = (0, express_1.Router)();
exports.adminSettingsRouter.get('/', async (req, res, next) => {
    try {
        let settings = await database_1.default.adminSettings.findFirst();
        if (!settings) {
            settings = await database_1.default.adminSettings.create({ data: {} });
        }
        // Remove sensitive fields
        const { geminiApiKey, ...safeSettings } = settings;
        res.json({ success: true, data: { settings: { ...safeSettings, hasGeminiKey: !!geminiApiKey } } });
    }
    catch (error) {
        next(error);
    }
});
exports.adminSettingsRouter.put('/', async (req, res, next) => {
    try {
        const settings = await database_1.default.adminSettings.upsert({
            where: { id: '1' },
            update: req.body,
            create: { id: '1', ...req.body },
        });
        res.json({ success: true, data: { settings } });
    }
    catch (error) {
        next(error);
    }
});
exports.adminSettingsRouter.post('/change-password', async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword)
            throw new errorHandler_middleware_1.AppError('Both passwords required', 400);
        if (newPassword.length < 8)
            throw new errorHandler_middleware_1.AppError('New password must be at least 8 chars', 400);
        const user = await database_1.default.user.findUnique({ where: { id: req.user.userId } });
        if (!user)
            throw new errorHandler_middleware_1.AppError('User not found', 404);
        const isValid = await bcrypt_1.default.compare(currentPassword, user.passwordHash);
        if (!isValid)
            throw new errorHandler_middleware_1.AppError('Current password is incorrect', 400);
        const passwordHash = await bcrypt_1.default.hash(newPassword, 12);
        await database_1.default.user.update({ where: { id: user.id }, data: { passwordHash } });
        res.json({ success: true, message: 'Password changed successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.adminSettingsRouter.get('/audit-logs', async (req, res, next) => {
    try {
        const { page = '1', limit = '50' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const [logs, total] = await Promise.all([
            database_1.default.auditLog.findMany({
                skip: (pageNum - 1) * limitNum, take: limitNum,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { email: true, username: true } } },
            }),
            database_1.default.auditLog.count(),
        ]);
        res.json({ success: true, data: { logs, pagination: { total, page: pageNum, limit: limitNum } } });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=settings.routes.js.map