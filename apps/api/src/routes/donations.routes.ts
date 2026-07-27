import { Router } from 'express';
import { donationController } from '../controllers/donation.controller';
import { optionalAuth, authenticate } from '../middleware/auth.middleware';

export const donationRouter = Router();

donationRouter.post('/initiate', optionalAuth, donationController.initiate);
donationRouter.post('/verify', optionalAuth, donationController.verify);
donationRouter.get('/tx/:txId', donationController.getByTxId);
donationRouter.get('/my', authenticate, donationController.getMyDonations);
