export declare const generateRandomToken: (bytes?: number) => string;
export declare const generateHmacSignature: (data: string, secret: string) => string;
export declare const verifyHmacSignature: (data: string, signature: string, secret: string) => boolean;
export declare const hashString: (input: string) => string;
export declare const generateOtp: () => string;
//# sourceMappingURL=crypto.util.d.ts.map