import { Request, Response, NextFunction } from 'express';

export const mockAuth = (req: Request, res: Response, next: NextFunction) => {
  (req as any).user = {
    openId: '123456',
  };
  next();
};

