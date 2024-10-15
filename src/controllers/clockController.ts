import { Request, Response, NextFunction } from 'express';
import { ClockService } from '../services/clockService';

const clockService = new ClockService();

export const clockIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const result = await clockService.clockIn(userId);
    res.status(200).json({
      success: true,
      message: '上班打卡成功',
      data: result,
    });
  } catch (error) {
    console.error('上班打卡出错:', error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const clockOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const result = await clockService.clockOut(userId);
    res.status(200).json({
      success: true,
      message: '下班打卡成功',
      data: result,
    });
  } catch (error) {
    console.error('下班打卡出错:', error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

export const getTodayClockRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const clockRecord = await clockService.getTodayClockRecord(userId);

    res.status(200).json({
      success: true,
      clockRecord,
    });
  } catch (error) {
    console.error('获取今日打卡记录出错:', error);
    next(error);
  }
};
