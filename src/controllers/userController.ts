import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

// 正式环境
export const setWorkSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ratedDailySalary, ratedWorkStartTime, ratedWorkEndTime } = req.body;
    const userId = (req as any).userId;

    console.log(`Setting work settings for userId: ${userId}`);

    if (!ratedDailySalary || !ratedWorkStartTime || !ratedWorkEndTime) {
      console.log('Missing required parameters');
      res.status(400).json({ success: false, message: '缺少必要的参数' });
      return;
    }

    const updatedUser = await userService.setWorkSettings(userId, ratedDailySalary, ratedWorkStartTime, ratedWorkEndTime);

    if (!updatedUser) {
      console.log(`User not found for userId: ${userId}`);
      res.status(404).json({ success: false, message: '用户不存在' });
      return;
    }

    console.log(`Work settings updated for userId: ${userId}`);

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error in setWorkSettings:', error);
    next(error);
  }
};