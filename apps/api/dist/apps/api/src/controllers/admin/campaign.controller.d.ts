import { Request, Response, NextFunction } from 'express';
export declare const adminCampaignController: {
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    triggerAiVerification(req: Request, res: Response, next: NextFunction): Promise<void>;
    exportData(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=campaign.controller.d.ts.map