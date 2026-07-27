import { Request, Response, NextFunction } from 'express';
export declare const auditLog: (action: string, resource: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auditLog.middleware.d.ts.map