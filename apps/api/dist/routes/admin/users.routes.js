"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserRouter = void 0;
const express_1 = require("express");
const database_1 = __importDefault(require("@trustfundx/database"));
exports.adminUserRouter = (0, express_1.Router)();
exports.adminUserRouter.get('/', async (req, res, next) => {
    try {
        const { page = '1', limit = '20' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const [users, total] = await Promise.all([
            database_1.default.user.findMany({
                skip: (pageNum - 1) * limitNum, take: limitNum,
                orderBy: { createdAt: 'desc' },
                select: { id: true, email: true, username: true, firstName: true, lastName: true, role: true, walletAddress: true, isEmailVerified: true, lastLoginAt: true, createdAt: true, _count: { select: { donations: true } } },
            }),
            database_1.default.user.count(),
        ]);
        res.json({ success: true, data: { users, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } } });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=users.routes.js.map