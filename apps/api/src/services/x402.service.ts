import crypto from 'crypto';
import { generateHmacSignature, hashString } from '../utils/crypto.util';
import { logger } from '../utils/logger';

export interface X402PaymentRequest {
  x402Version: number;
  error: string;
  accepts: X402PaymentOption[];
}

export interface X402PaymentOption {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
  mimeType: string;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: string;
  extra: {
    campaignId: string;
    campaignName: string;
    donationId: string;
  };
}

export interface X402Receipt {
  receiptId: string;
  txId: string;
  campaignId: string;
  donationId: string;
  amount: string;
  asset: string;
  network: string;
  payTo: string;
  paidAt: string;
  signature: string;
  x402Version: number;
}

export const x402Service = {
  generatePaymentRequest(
    campaignId: string,
    campaignName: string,
    donationId: string,
    beneficiaryWallet: string,
    amountInMicroAlgo: number,
    resource: string
  ): X402PaymentRequest {
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

  generateReceipt(
    txId: string,
    campaignId: string,
    donationId: string,
    amount: string,
    beneficiaryWallet: string
  ): X402Receipt {
    const secret = process.env.X402_SECRET_KEY!;
    const paidAt = new Date().toISOString();
    const receiptId = crypto.randomUUID();

    const dataToSign = `${receiptId}:${txId}:${campaignId}:${donationId}:${amount}:${paidAt}`;
    const signature = generateHmacSignature(dataToSign, secret);

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

  verifyReceipt(receipt: X402Receipt): boolean {
    try {
      const secret = process.env.X402_SECRET_KEY!;
      const dataToSign = `${receipt.receiptId}:${receipt.txId}:${receipt.campaignId}:${receipt.donationId}:${receipt.amount}:${receipt.paidAt}`;
      const expectedSig = generateHmacSignature(dataToSign, secret);
      return crypto.timingSafeEqual(
        Buffer.from(expectedSig),
        Buffer.from(receipt.signature)
      );
    } catch (error) {
      logger.error('Receipt verification failed:', error);
      return false;
    }
  },

  serializeReceipt(receipt: X402Receipt): string {
    return Buffer.from(JSON.stringify(receipt)).toString('base64');
  },

  deserializeReceipt(encoded: string): X402Receipt {
    return JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'));
  },
};
