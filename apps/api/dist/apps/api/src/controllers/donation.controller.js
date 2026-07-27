"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donationController = void 0;
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("@trustfundx/database"));
const algorand_service_1 = require("../services/algorand.service");
const x402_service_1 = require("../services/x402.service");
const email_service_1 = require("../services/email.service");
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
const logger_1 = require("../utils/logger");
exports.donationController = {
    async initiate(req, res, next) {
        try {
            const { campaignId, amount, donorWallet, message, isAnonymous } = req.body;
            if (!campaignId || !amount || !donorWallet) {
                throw new errorHandler_middleware_1.AppError('campaignId, amount, and donorWallet are required', 400);
            }
            if (amount <= 0)
                throw new errorHandler_middleware_1.AppError('Amount must be greater than 0', 400);
            if (!algorand_service_1.algorandService.isValidAddress(donorWallet)) {
                throw new errorHandler_middleware_1.AppError('Invalid Algorand wallet address', 400);
            }
            const campaign = await database_1.default.campaign.findUnique({
                where: { id: campaignId, isPublished: true, status: 'ACTIVE' },
            });
            if (!campaign)
                throw new errorHandler_middleware_1.AppError('Campaign not found or not active', 404);
            const donationId = (0, uuid_1.v4)();
            const amountInMicroAlgo = Math.round(amount * 1000000);
            // Create pending donation
            const donation = await database_1.default.donation.create({
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
            const paymentRequest = x402_service_1.x402Service.generatePaymentRequest(campaignId, campaign.name, donationId, campaign.beneficiaryWallet, amountInMicroAlgo, `/api/donations/verify`);
            await database_1.default.donation.update({
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
        }
        catch (error) {
            next(error);
        }
    },
    async verify(req, res, next) {
        try {
            const { donationId, algorandTxId } = req.body;
            if (!donationId || !algorandTxId) {
                throw new errorHandler_middleware_1.AppError('donationId and algorandTxId are required', 400);
            }
            const donation = await database_1.default.donation.findUnique({ where: { id: donationId } });
            if (!donation)
                throw new errorHandler_middleware_1.AppError('Donation not found', 404);
            if (donation.status === 'CONFIRMED') {
                res.json({ success: true, message: 'Donation already confirmed', data: { donation } });
                return;
            }
            const campaign = await database_1.default.campaign.findUnique({ where: { id: donation.campaignId } });
            if (!campaign)
                throw new errorHandler_middleware_1.AppError('Campaign not found', 404);
            // Verify on Algorand blockchain
            const txInfo = await algorand_service_1.algorandService.verifyTransaction(algorandTxId);
            if (!txInfo)
                throw new errorHandler_middleware_1.AppError('Transaction not found or not yet confirmed', 400);
            // Verify receiver is the beneficiary wallet
            if (txInfo.receiver !== campaign.beneficiaryWallet) {
                throw new errorHandler_middleware_1.AppError('Transaction receiver does not match beneficiary wallet', 400);
            }
            // Generate x402 receipt
            const receipt = x402_service_1.x402Service.generateReceipt(algorandTxId, donation.campaignId, donationId, txInfo.amount.toString(), campaign.beneficiaryWallet);
            const serializedReceipt = x402_service_1.x402Service.serializeReceipt(receipt);
            const receiptHash = receipt.signature;
            // Update donation to confirmed
            const updatedDonation = await database_1.default.donation.update({
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
            await database_1.default.campaign.update({
                where: { id: donation.campaignId },
                data: {
                    raisedAmount: { increment: txInfo.amount },
                    donorsCount: { increment: 1 },
                },
            });
            // Create transaction record
            await database_1.default.transaction.create({
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
                    await email_service_1.emailService.sendDonationConfirmation(donation.donorEmail || req.user.email, campaign.name, txInfo.amount, algorandTxId);
                }
                catch (err) {
                    logger_1.logger.error('Failed to send donation confirmation email:', err);
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
        }
        catch (error) {
            next(error);
        }
    },
    async getByTxId(req, res, next) {
        try {
            const txId = req.params.txId;
            const donation = await database_1.default.donation.findUnique({
                where: { algorandTxId: txId },
                include: { campaign: { select: { name: true, disasterType: true } } },
            });
            if (!donation)
                throw new errorHandler_middleware_1.AppError('Donation not found', 404);
            res.json({ success: true, data: { donation } });
        }
        catch (error) {
            next(error);
        }
    },
    async getMyDonations(req, res, next) {
        try {
            const donations = await database_1.default.donation.findMany({
                where: { donorId: req.user.userId },
                orderBy: { createdAt: 'desc' },
                include: { campaign: { select: { name: true, bannerImage: true, disasterType: true } } },
            });
            res.json({ success: true, data: { donations } });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=donation.controller.js.map