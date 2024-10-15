// src/controllers/statsController.ts
import { Request, Response, NextFunction } from 'express';
import { StatsService } from '../services/statsService';

const statsService = new StatsService();

export const getHeatmapData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { startDate, endDate, type } = req.query;

    if (!startDate || !endDate || !type) {
      res.status(400).json({ success: false, message: '缺少必要的查询参数' });
      return;
    }

    if (type !== 'hourlyRate' && type !== 'workHours') {
      res.status(400).json({ success: false, message: '无效的类型参数' });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ success: false, message: '无效的日期格式' });
      return;
    }

    const data = await statsService.getHeatmapData(userId, start, end, type);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('获取热力图数据出错:', error);
    next(error);
  }
};

