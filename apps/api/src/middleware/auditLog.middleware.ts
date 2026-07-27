import { Request, Response, NextFunction } from 'express';
import prisma from '@trustfundx/database';
import { logger } from '../utils/logger';

export const auditLog = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      // Log after response
      setImmediate(async () => {
        try {
          await prisma.auditLog.create({
            data: {
              userId: req.user?.userId,
              action,
              resource,
              resourceId: req.params.id as string,
              details: { body: req.body, params: req.params, query: req.query },
              ipAddress: req.ip,
              userAgent: req.get('user-agent'),
              success: res.statusCode < 400,
            },
          });
        } catch (err) {
          logger.error('Audit log failed:', err);
        }
      });
      return originalJson(data);
    };
    next();
  };
};
