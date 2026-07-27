import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '@trustfundx/database';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.util';
import { generateRandomToken } from '../utils/crypto.util';
import { emailService } from '../services/email.service';
import { AppError } from '../middleware/errorHandler.middleware';
import { logger } from '../utils/logger';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, firstName, lastName, username } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }
      if (password.length < 8) {
        throw new AppError('Password must be at least 8 characters', 400);
      }

      const existing = await prisma.user.findFirst({
        where: { OR: [{ email }, { username: username || undefined }] },
      });
      if (existing) {
        throw new AppError('Email or username already exists', 409);
      }

      const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12'));
      const emailVerifyToken = generateRandomToken();

      const user = await prisma.user.create({
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
        await emailService.sendVerificationEmail(email, emailVerifyToken);
      } catch (emailErr) {
        logger.error('Failed to send verification email:', emailErr);
      }

      const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

      res.status(201).json({
        success: true,
        message: 'Account created successfully. Please verify your email.',
        data: {
          user: { id: user.id, email: user.email, firstName: user.firstName, role: user.role },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        throw new AppError('Invalid email or password', 401);
      }

      await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

      const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

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
    } catch (error) {
      next(error);
    }
  },

  async logout(_req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: 'Logged out successfully' });
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        const token = generateRandomToken();
        const expiry = new Date(Date.now() + 60 * 60 * 1000);
        await prisma.user.update({
          where: { id: user.id },
          data: { resetPasswordToken: token, resetPasswordExpiry: expiry },
        });
        try {
          await emailService.sendPasswordResetEmail(email, token);
        } catch (err) {
          logger.error('Failed to send reset email:', err);
        }
      }

      res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;
      if (!token || !password) throw new AppError('Token and password required', 400);
      if (password.length < 8) throw new AppError('Password must be at least 8 characters', 400);

      const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordExpiry: { gt: new Date() },
        },
      });

      if (!user) throw new AppError('Invalid or expired reset token', 400);

      const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12'));
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, resetPasswordToken: null, resetPasswordExpiry: null },
      });

      res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      next(error);
    }
  },

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.query;
      if (!token) throw new AppError('Verification token required', 400);

      const user = await prisma.user.findFirst({ where: { emailVerifyToken: token as string } });
      if (!user) throw new AppError('Invalid verification token', 400);

      await prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true, emailVerifyToken: null },
      });

      res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new AppError('Refresh token required', 400);

      const payload = verifyRefreshToken(refreshToken);
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) throw new AppError('User not found', 401);

      const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
      res.json({ success: true, data: { accessToken } });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
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
      if (!user) throw new AppError('User not found', 404);
      res.json({ success: true, data: { user } });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, username, avatar } = req.body;
      const user = await prisma.user.update({
        where: { id: req.user!.userId },
        data: { firstName, lastName, username, avatar },
        select: { id: true, email: true, firstName: true, lastName: true, username: true, avatar: true },
      });
      res.json({ success: true, data: { user } });
    } catch (error) {
      next(error);
    }
  },

  async connectWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { walletAddress } = req.body;
      if (!walletAddress) throw new AppError('Wallet address required', 400);

      const user = await prisma.user.update({
        where: { id: req.user!.userId },
        data: { walletAddress },
        select: { id: true, email: true, walletAddress: true },
      });
      res.json({ success: true, data: { user } });
    } catch (error) {
      next(error);
    }
  },
};
