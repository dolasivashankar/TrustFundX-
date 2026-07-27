export declare const emailService: {
    sendVerificationEmail(email: string, token: string): Promise<void>;
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
    sendDonationConfirmation(email: string, campaignName: string, amount: number, txId: string): Promise<void>;
};
//# sourceMappingURL=email.service.d.ts.map