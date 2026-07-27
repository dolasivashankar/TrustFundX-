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
export declare const x402Service: {
    generatePaymentRequest(campaignId: string, campaignName: string, donationId: string, beneficiaryWallet: string, amountInMicroAlgo: number, resource: string): X402PaymentRequest;
    generateReceipt(txId: string, campaignId: string, donationId: string, amount: string, beneficiaryWallet: string): X402Receipt;
    verifyReceipt(receipt: X402Receipt): boolean;
    serializeReceipt(receipt: X402Receipt): string;
    deserializeReceipt(encoded: string): X402Receipt;
};
//# sourceMappingURL=x402.service.d.ts.map