import { Request, Response, NextFunction } from 'express';
export declare const adminAnalyticsController: {
    getDailyDonations(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMonthlyDonations(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getCountryWise(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getDisasterCategories(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getCampaignSuccessRate(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getDonationTrends(_req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=analytics.controller.d.ts.map