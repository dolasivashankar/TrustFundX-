import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

export const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authenticate, authController.logout);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.get('/verify-email', authController.verifyEmail);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.get('/me', authenticate, authController.getMe);
authRouter.put('/me', authenticate, authController.updateProfile);
authRouter.post('/connect-wallet', authenticate, authController.connectWallet);
