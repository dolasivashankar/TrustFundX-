"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_1 = require("http");
const auth_routes_1 = require("./routes/auth.routes");
const campaigns_routes_1 = require("./routes/campaigns.routes");
const donations_routes_1 = require("./routes/donations.routes");
const index_routes_1 = require("./routes/admin/index.routes");
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const notFound_middleware_1 = require("./middleware/notFound.middleware");
const logger_1 = require("./utils/logger");
const swagger_routes_1 = require("./routes/swagger.routes");
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 4000;
// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================
app.use((0, helmet_1.default)({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
}));
// ============================================================================
// CORS
// ============================================================================
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || corsOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-PAYMENT',
        'X-402-Version',
        'X-Request-ID',
    ],
    exposedHeaders: ['X-PAYMENT-RESPONSE', 'X-402-Receipt'],
}));
// ============================================================================
// RATE LIMITING
// ============================================================================
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many requests from this IP. Please try again later.',
    },
});
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: 'Too many authentication attempts. Please try again in 15 minutes.',
    },
});
app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);
// ============================================================================
// REQUEST PARSING
// ============================================================================
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, morgan_1.default)('combined', { stream: { write: (msg) => logger_1.logger.http(msg.trim()) } }));
// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get('/health', (_req, res) => {
    res.json({
        status: 'healthy',
        service: 'TrustFundX API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        algorandNetwork: process.env.ALGORAND_NETWORK || 'testnet',
    });
});
// ============================================================================
// ROUTES
// ============================================================================
app.use('/api-docs', swagger_routes_1.swaggerRouter);
app.use('/api/auth', auth_routes_1.authRouter);
app.use('/api/campaigns', campaigns_routes_1.campaignRouter);
app.use('/api/donations', donations_routes_1.donationRouter);
app.use('/api/admin', index_routes_1.adminRouter);
// ============================================================================
// ERROR HANDLING
// ============================================================================
app.use(notFound_middleware_1.notFound);
app.use(errorHandler_middleware_1.errorHandler);
// ============================================================================
// START SERVER
// ============================================================================
const server = (0, http_1.createServer)(app);
server.listen(PORT, () => {
    logger_1.logger.info(`🚀 TrustFundX API running on http://localhost:${PORT}`);
    logger_1.logger.info(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
    logger_1.logger.info(`🔗 Algorand Network: ${process.env.ALGORAND_NETWORK || 'testnet'}`);
    logger_1.logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
});
//# sourceMappingURL=index.js.map