"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerRouter = void 0;
const express_1 = require("express");
// @ts-ignore
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerRouter = (0, express_1.Router)();
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'TrustFundX API',
        version: '1.0.0',
        description: 'AI-Powered Emergency Relief & Disaster Funding Network API',
        contact: { name: 'TrustFundX Team', email: 'api@trustfundx.com' },
    },
    servers: [
        { url: 'http://localhost:4000', description: 'Development' },
        { url: 'https://api.trustfundx.com', description: 'Production' },
    ],
    components: {
        securitySchemes: {
            BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
    },
    paths: {
        '/health': {
            get: {
                summary: 'Health check',
                responses: { '200': { description: 'API is healthy' } },
            },
        },
        '/api/auth/register': {
            post: {
                summary: 'Register a new user',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', minLength: 8 },
                                    firstName: { type: 'string' },
                                    lastName: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '201': { description: 'User registered successfully' },
                    '409': { description: 'Email already exists' },
                },
            },
        },
        '/api/auth/login': {
            post: {
                summary: 'Login',
                tags: ['Authentication'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: { '200': { description: 'Login successful' }, '401': { description: 'Invalid credentials' } },
            },
        },
        '/api/campaigns': {
            get: {
                summary: 'Get all campaigns',
                tags: ['Campaigns'],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
                    { name: 'status', in: 'query', schema: { type: 'string' } },
                    { name: 'disasterType', in: 'query', schema: { type: 'string' } },
                    { name: 'search', in: 'query', schema: { type: 'string' } },
                ],
                responses: { '200': { description: 'List of campaigns' } },
            },
        },
        '/api/donations/initiate': {
            post: {
                summary: 'Initiate a donation and get x402 payment request',
                tags: ['Donations'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['campaignId', 'amount', 'donorWallet'],
                                properties: {
                                    campaignId: { type: 'string' },
                                    amount: { type: 'number' },
                                    donorWallet: { type: 'string' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: { '200': { description: 'Payment request generated' } },
            },
        },
        '/api/donations/verify': {
            post: {
                summary: 'Verify Algorand transaction and confirm donation',
                tags: ['Donations'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['donationId', 'algorandTxId'],
                                properties: {
                                    donationId: { type: 'string' },
                                    algorandTxId: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: { '200': { description: 'Donation confirmed' } },
            },
        },
    },
};
exports.swaggerRouter.use('/', swagger_ui_express_1.default.serve);
exports.swaggerRouter.get('/', swagger_ui_express_1.default.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { background: linear-gradient(135deg, #b8860b, #ffd700); }',
    customSiteTitle: 'TrustFundX API Docs',
}));
//# sourceMappingURL=swagger.routes.js.map