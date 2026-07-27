"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireAdmin = exports.authenticate = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const errorHandler_middleware_1 = require("./errorHandler.middleware");
const database_1 = __importDefault(require("@trustfundx/database"));
const authenticate = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errorHandler_middleware_1.AppError('Authentication token required', 401);
        }
        const token = authHeader.split(' ')[1];
        const payload = (0, jwt_util_1.verifyAccessToken)(token);
        const user = await database_1.default.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, email: true, role: true, isEmailVerified: true },
        });
        if (!user) {
            throw new errorHandler_middleware_1.AppError('User not found', 401);
        }
        req.user = { userId: user.id, email: user.email, role: user.role };
        next();
    }
    catch (error) {
        if (error instanceof errorHandler_middleware_1.AppError) {
            next(error);
        }
        else {
            next(new errorHandler_middleware_1.AppError('Invalid or expired token', 401));
        }
    }
};
exports.authenticate = authenticate;
const requireAdmin = (req, _res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        next(new errorHandler_middleware_1.AppError('Admin access required', 403));
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
const optionalAuth = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const payload = (0, jwt_util_1.verifyAccessToken)(token);
            req.user = { userId: payload.userId, email: payload.email, role: payload.role };
        }
    }
    catch {
        // Token invalid but optional, continue
    }
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.middleware.js.map