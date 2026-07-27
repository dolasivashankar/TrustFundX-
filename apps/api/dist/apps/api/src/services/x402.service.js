"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.x402Service = void 0;
const crypto_1 = __importDefault(require("crypto"));
const crypto_util_1 = require("../utils/crypto.util");
const logger_1 = require("../utils/logger");
exports.x402Service = {
    generatePaymentRequest(campaignId, campaignName, donationId, beneficiaryWallet, amountInMicroAlgo, resource) {
        return {
            x402Version: 1,
            error: 'Payment Required',
            accepts: [
                {
                    scheme: 'algorand-exact',
                    network: process.env.X402_NETWORK || 'algorand-testnet',
                    maxAmountRequired: amountInMicroAlgo.toString(),
                    resource,
                    description: `Donation to ${campaignName} disaster relief campaign`,
                    mimeType: 'application/json',
                    payTo: beneficiaryWallet,
                    maxTimeoutSeconds: parseInt(process.env.X402_MAX_TIMEOUT_SECONDS || '300'),
                    asset: 'ALGO',
                    extra: {
                        campaignId,
                        campaignName,
                        donationId,
                    },
                },
            ],
        };
    },
    generateReceipt(txId, campaignId, donationId, amount, beneficiaryWallet) {
        const secret = process.env.X402_SECRET_KEY;
        const paidAt = new Date().toISOString();
        const receiptId = crypto_1.default.randomUUID();
        const dataToSign = `${receiptId}:${txId}:${campaignId}:${donationId}:${amount}:${paidAt}`;
        const signature = (0, crypto_util_1.generateHmacSignature)(dataToSign, secret);
        return {
            receiptId,
            txId,
            campaignId,
            donationId,
            amount,
            asset: 'ALGO',
            network: process.env.X402_NETWORK || 'algorand-testnet',
            payTo: beneficiaryWallet,
            paidAt,
            signature,
            x402Version: 1,
        };
    },
    verifyReceipt(receipt) {
        try {
            const secret = process.env.X402_SECRET_KEY;
            const dataToSign = `${receipt.receiptId}:${receipt.txId}:${receipt.campaignId}:${receipt.donationId}:${receipt.amount}:${receipt.paidAt}`;
            const expectedSig = (0, crypto_util_1.generateHmacSignature)(dataToSign, secret);
            return crypto_1.default.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(receipt.signature));
        }
        catch (error) {
            logger_1.logger.error('Receipt verification failed:', error);
            return false;
        }
    },
    serializeReceipt(receipt) {
        return Buffer.from(JSON.stringify(receipt)).toString('base64');
    },
    deserializeReceipt(encoded) {
        return JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'));
    },
};
//# sourceMappingURL=x402.service.js.map