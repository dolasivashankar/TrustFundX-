"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = void 0;
const database_1 = __importDefault(require("@trustfundx/database"));
const logger_1 = require("../utils/logger");
const auditLog = (action, resource) => {
    return async (req, res, next) => {
        const originalJson = res.json.bind(res);
        res.json = (data) => {
            // Log after response
            setImmediate(async () => {
                try {
                    await database_1.default.auditLog.create({
                        data: {
                            userId: req.user?.userId,
                            action,
                            resource,
                            resourceId: req.params.id,
                            details: { body: req.body, params: req.params, query: req.query },
                            ipAddress: req.ip,
                            userAgent: req.get('user-agent'),
                            success: res.statusCode < 400,
                        },
                    });
                }
                catch (err) {
                    logger_1.logger.error('Audit log failed:', err);
                }
            });
            return originalJson(data);
        };
        next();
    };
};
exports.auditLog = auditLog;
//# sourceMappingURL=auditLog.middleware.js.map