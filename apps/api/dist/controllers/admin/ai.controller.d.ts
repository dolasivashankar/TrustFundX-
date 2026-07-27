import { Request, Response, NextFunction } from 'express';
export declare const aiAdminController: {
    getAlerts(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAnalyses(_req: Request, res: Response, next: NextFunction): Promise<void>;
    resolveAlert(req: Request, res: Response, next: NextFunction): Promise<void>;
    analyzeOne(req: Request, res: Response, next: NextFunction): Promise<void>;
    analyzeAll(_req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=ai.controller.d.ts.map