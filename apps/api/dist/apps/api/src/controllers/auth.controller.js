"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("@trustfundx/database"));
const jwt_util_1 = require("../utils/jwt.util");
const crypto_util_1 = require("../utils/crypto.util");
const email_service_1 = require("../services/email.service");
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
const logger_1 = require("../utils/logger");
exports.authController = {
    async register(req, res, next) {
        try {
            const { email, password, firstName, lastName, username } = req.body;
            if (!email || !password) {
                throw new errorHandler_middleware_1.AppError('Email and password are required', 400);
            }
            if (password.length < 8) {
                throw new errorHandler_middleware_1.AppError('Password must be at least 8 characters', 400);
            }
            const existing = await database_1.default.user.findFirst({
                where: { OR: [{ email }, { username: username || undefined }] },
            });
            if (existing) {
                throw new errorHandler_middleware_1.AppError('Email or username already exists', 409);
            }
            const passwordHash = await bcrypt_1.default.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12'));
            const emailVerifyToken = (0, crypto_util_1.generateRandomToken)();
            const user = await database_1.default.user.create({
                data: {
                    email,
                    username,
                    passwordHash,
                    firstName,
                    lastName,
                    emailVerifyToken,
                    role: 'USER',
                },
            });
            try {
                await email_service_1.emailService.sendVerificationEmail(email, emailVerifyToken);
            }
            catch (emailErr) {
                logger_1.logger.error('Failed to send verification email:', emailErr);
            }
            const accessToken = (0, jwt_util_1.generateAccessToken)({ userId: user.id, email: user.email, role: user.role });
            const refreshToken = (0, jwt_util_1.generateRefreshToken)({ userId: user.id, email: user.email, role: user.role });
            res.status(201).json({
                success: true,
                message: 'Account created successfully. Please verify your email.',
                data: {
                    user: { id: user.id, email: user.email, firstName: user.firstName, role: user.role },
                    accessToken,
                    refreshToken,
                },
            });
        }
        catch (error) {
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new errorHandler_middleware_1.AppError('Email and password are required', 400);
            }
            const user = await database_1.default.user.findUnique({ where: { email } });
            if (!user) {
                throw new errorHandler_middleware_1.AppError('Invalid email or password', 401);
            }
            const isValid = await bcrypt_1.default.compare(password, user.passwordHash);
            if (!isValid) {
                throw new errorHandler_middleware_1.AppError('Invalid email or password', 401);
            }
            await database_1.default.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
            const accessToken = (0, jwt_util_1.generateAccessToken)({ userId: user.id, email: user.email, role: user.role });
            const refreshToken = (0, jwt_util_1.generateRefreshToken)({ userId: user.id, email: user.email, role: user.role });
            res.json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        role: user.role,
                        walletAddress: user.walletAddress,
                        isEmailVerified: user.isEmailVerified,
                        avatar: user.avatar,
                    },
                    accessToken,
                    refreshToken,
                },
            });
        }
        catch (error) {
            next(error);
        }
    },
    async logout(_req, res) {
        res.json({ success: true, message: 'Logged out successfully' });
    },
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const user = await database_1.default.user.findUnique({ where: { email } });
            if (user) {
                const token = (0, crypto_util_1.generateRandomToken)();
                const expiry = new Date(Date.now() + 60 * 60 * 1000);
                await database_1.default.user.update({
                    where: { id: user.id },
                    data: { resetPasswordToken: token, resetPasswordExpiry: expiry },
                });
                try {
                    await email_service_1.emailService.sendPasswordResetEmail(email, token);
                }
                catch (err) {
                    logger_1.logger.error('Failed to send reset email:', err);
                }
            }
            res.json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.',
            });
        }
        catch (error) {
            next(error);
        }
    },
    async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            if (!token || !password)
                throw new errorHandler_middleware_1.AppError('Token and password required', 400);
            if (password.length < 8)
                throw new errorHandler_middleware_1.AppError('Password must be at least 8 characters', 400);
            const user = await database_1.default.user.findFirst({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpiry: { gt: new Date() },
                },
            });
            if (!user)
                throw new errorHandler_middleware_1.AppError('Invalid or expired reset token', 400);
            const passwordHash = await bcrypt_1.default.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12'));
            await database_1.default.user.update({
                where: { id: user.id },
                data: { passwordHash, resetPasswordToken: null, resetPasswordExpiry: null },
            });
            res.json({ success: true, message: 'Password reset successfully' });
        }
        catch (error) {
            next(error);
        }
    },
    async verifyEmail(req, res, next) {
        try {
            const { token } = req.query;
            if (!token)
                throw new errorHandler_middleware_1.AppError('Verification token required', 400);
            const user = await database_1.default.user.findFirst({ where: { emailVerifyToken: token } });
            if (!user)
                throw new errorHandler_middleware_1.AppError('Invalid verification token', 400);
            await database_1.default.user.update({
                where: { id: user.id },
                data: { isEmailVerified: true, emailVerifyToken: null },
            });
            res.json({ success: true, message: 'Email verified successfully' });
        }
        catch (error) {
            next(error);
        }
    },
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken)
                throw new errorHandler_middleware_1.AppError('Refresh token required', 400);
            const payload = (0, jwt_util_1.verifyRefreshToken)(refreshToken);
            const user = await database_1.default.user.findUnique({ where: { id: payload.userId } });
            if (!user)
                throw new errorHandler_middleware_1.AppError('User not found', 401);
            const accessToken = (0, jwt_util_1.generateAccessToken)({ userId: user.id, email: user.email, role: user.role });
            res.json({ success: true, data: { accessToken } });
        }
        catch (error) {
            next(error);
        }
    },
    async getMe(req, res, next) {
        try {
            const user = await database_1.default.user.findUnique({
                where: { id: req.user.userId },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    role: true,
                    walletAddress: true,
                    isEmailVerified: true,
                    twoFactorEnabled: true,
                    lastLoginAt: true,
                    createdAt: true,
                },
            });
            if (!user)
                throw new errorHandler_middleware_1.AppError('User not found', 404);
            res.json({ success: true, data: { user } });
        }
        catch (error) {
            next(error);
        }
    },
    async updateProfile(req, res, next) {
        try {
            const { firstName, lastName, username, avatar } = req.body;
            const user = await database_1.default.user.update({
                where: { id: req.user.userId },
                data: { firstName, lastName, username, avatar },
                select: { id: true, email: true, firstName: true, lastName: true, username: true, avatar: true },
            });
            res.json({ success: true, data: { user } });
        }
        catch (error) {
            next(error);
        }
    },
    async connectWallet(req, res, next) {
        try {
            const { walletAddress } = req.body;
            if (!walletAddress)
                throw new errorHandler_middleware_1.AppError('Wallet address required', 400);
            const user = await database_1.default.user.update({
                where: { id: req.user.userId },
                data: { walletAddress },
                select: { id: true, email: true, walletAddress: true },
            });
            res.json({ success: true, data: { user } });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=auth.controller.js.map