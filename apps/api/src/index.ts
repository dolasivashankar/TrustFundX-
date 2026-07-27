import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';

import { authRouter } from './routes/auth.routes';
import { campaignRouter } from './routes/campaigns.routes';
import { donationRouter } from './routes/donations.routes';
import { adminRouter } from './routes/admin/index.routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import { notFound } from './middleware/notFound.middleware';
import { logger } from './utils/logger';
import { swaggerRouter } from './routes/swagger.routes';

const app = express();
const PORT = process.env.PORT || 4000;

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

// ============================================================================
// CORS
// ============================================================================

const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
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
  })
);

// ============================================================================
// RATE LIMITING
// ============================================================================

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again later.',
  },
});

const authLimiter = rateLimit({
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

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: { write: (msg) => logger.http(msg.trim()) } }));

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

app.use('/api-docs', swaggerRouter);
app.use('/api/auth', authRouter);
app.use('/api/campaigns', campaignRouter);
app.use('/api/donations', donationRouter);
app.use('/api/admin', adminRouter);

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use(notFound);
app.use(errorHandler);

// ============================================================================
// START SERVER
// ============================================================================

const server = createServer(app);

server.listen(PORT, () => {
  logger.info(`🚀 TrustFundX API running on http://localhost:${PORT}`);
  logger.info(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
  logger.info(`🔗 Algorand Network: ${process.env.ALGORAND_NETWORK || 'testnet'}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
});

export { app };
