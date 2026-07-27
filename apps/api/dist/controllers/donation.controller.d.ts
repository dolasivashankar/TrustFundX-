import { Request, Response, NextFunction } from 'express';
export declare const donationController: {
    initiate(req: Request, res: Response, next: NextFunction): Promise<void>;
    verify(req: Request, res: Response, next: NextFunction): Promise<void>;
    getByTxId(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMyDonations(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=donation.controller.d.ts.map