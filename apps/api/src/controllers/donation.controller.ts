import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@trustfundx/database';
import { algorandService } from '../services/algorand.service';
import { x402Service } from '../services/x402.service';
import { emailService } from '../services/email.service';
import { AppError } from '../middleware/errorHandler.middleware';
import { logger } from '../utils/logger';

export const donationController = {
  async initiate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { campaignId, amount, donorWallet, message, isAnonymous } = req.body;

      if (!campaignId || !amount || !donorWallet) {
        throw new AppError('campaignId, amount, and donorWallet are required', 400);
      }
      if (amount <= 0) throw new AppError('Amount must be greater than 0', 400);
      if (!algorandService.isValidAddress(donorWallet)) {
        throw new AppError('Invalid Algorand wallet address', 400);
      }

      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId, isPublished: true, status: 'ACTIVE' },
      });
      if (!campaign) throw new AppError('Campaign not found or not active', 404);

      const donationId = uuidv4();
      const amountInMicroAlgo = Math.round(amount * 1_000_000);

      // Create pending donation
      const donation = await prisma.donation.create({
        data: {
          id: donationId,
          campaignId,
          donorId: req.user?.userId,
          donorWallet,
          amount,
          amountInMicroAlgo,
          status: 'PENDING',
          message,
          isAnonymous: isAnonymous || false,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        },
      });

      // Generate x402 payment request
      const paymentRequest = x402Service.generatePaymentRequest(
        campaignId,
        campaign.name,
        donationId,
        campaign.beneficiaryWallet,
        amountInMicroAlgo,
        `/api/donations/verify`
      );

      await prisma.donation.update({
        where: { id: donationId },
        data: { x402PaymentRequest: JSON.stringify(paymentRequest) },
      });

      // Return 402-equivalent response with payment request
      res.status(200).json({
        success: true,
        data: {
          donationId,
          beneficiaryWallet: campaign.beneficiaryWallet,
          amountInMicroAlgo,
          amountInAlgo: amount,
          campaignName: campaign.name,
          paymentRequest,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { donationId, algorandTxId } = req.body;

      if (!donationId || !algorandTxId) {
        throw new AppError('donationId and algorandTxId are required', 400);
      }

      const donation = await prisma.donation.findUnique({ where: { id: donationId } });
      if (!donation) throw new AppError('Donation not found', 404);
      if (donation.status === 'CONFIRMED') {
        res.json({ success: true, message: 'Donation already confirmed', data: { donation } });
        return;
      }

      const campaign = await prisma.campaign.findUnique({ where: { id: donation.campaignId } });
      if (!campaign) throw new AppError('Campaign not found', 404);

      // Verify on Algorand blockchain
      const txInfo = await algorandService.verifyTransaction(algorandTxId);
      if (!txInfo) throw new AppError('Transaction not found or not yet confirmed', 400);

      // Verify receiver is the beneficiary wallet
      if (txInfo.receiver !== campaign.beneficiaryWallet) {
        throw new AppError('Transaction receiver does not match beneficiary wallet', 400);
      }

      // Generate x402 receipt
      const receipt = x402Service.generateReceipt(
        algorandTxId,
        donation.campaignId,
        donationId,
        txInfo.amount.toString(),
        campaign.beneficiaryWallet
      );
      const serializedReceipt = x402Service.serializeReceipt(receipt);
      const receiptHash = receipt.signature;

      // Update donation to confirmed
      const updatedDonation = await prisma.donation.update({
        where: { id: donationId },
        data: {
          status: 'CONFIRMED',
          algorandTxId,
          blockNumber: txInfo.blockRound,
          blockRound: txInfo.blockRound,
          confirmationRound: txInfo.confirmedRound,
          confirmationStatus: 'CONFIRMED',
          explorerUrl: txInfo.explorerUrl,
          x402Receipt: serializedReceipt,
          x402ReceiptHash: receiptHash,
          x402Verified: true,
        },
      });

      // Update campaign raised amount and donor count
      await prisma.campaign.update({
        where: { id: donation.campaignId },
        data: {
          raisedAmount: { increment: txInfo.amount },
          donorsCount: { increment: 1 },
        },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          donationId,
          campaignId: donation.campaignId,
          type: 'DONATION',
          amount: txInfo.amount,
          algorandTxId,
          fromAddress: txInfo.sender,
          toAddress: txInfo.receiver,
          fee: txInfo.fee,
          blockRound: txInfo.blockRound,
          status: 'CONFIRMED',
          explorerUrl: txInfo.explorerUrl,
          confirmedAt: new Date(),
        },
      });

      // Send confirmation email if donor has email
      if (donation.donorEmail || req.user?.email) {
        try {
          await emailService.sendDonationConfirmation(
            donation.donorEmail || req.user!.email,
            campaign.name,
            txInfo.amount,
            algorandTxId
          );
        } catch (err) {
          logger.error('Failed to send donation confirmation email:', err);
        }
      }

      res.json({
        success: true,
        message: 'Donation confirmed successfully!',
        data: {
          donation: updatedDonation,
          receipt,
          explorerUrl: txInfo.explorerUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getByTxId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const txId = req.params.txId as string;
      const donation = await prisma.donation.findUnique({
        where: { algorandTxId: txId },
        include: { campaign: { select: { name: true, disasterType: true } } },
      });
      if (!donation) throw new AppError('Donation not found', 404);
      res.json({ success: true, data: { donation } });
    } catch (error) {
      next(error);
    }
  },

  async getMyDonations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const donations = await prisma.donation.findMany({
        where: { donorId: req.user!.userId },
        orderBy: { createdAt: 'desc' },
        include: { campaign: { select: { name: true, bannerImage: true, disasterType: true } } },
      });
      res.json({ success: true, data: { donations } });
    } catch (error) {
      next(error);
    }
  },
};
