import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { ClockRecord } from '../models/ClockRecord';

/**
 * ClockService 类用于处理用户打卡相关的业务逻辑
 */
export class ClockService {
    
  /**
   * 用户上班打卡
   * @param userId 用户的 ID
   * @returns 打卡信息，包括打卡时间、额定工作开始时间、额定工作结束时间、额定小时工资、额定工作时长和额定日薪
   */
  async clockIn(userId: string): Promise<{
    clockInTime: Date;
    ratedWorkStartTime: string;
    ratedWorkEndTime: string;
    ratedHourlyRate: number;
    ratedWorkHours: number;
    ratedDailySalary: number;
  }> {
    // 获取用户和打卡记录的仓库
    const userRepository = getRepository(User);
    const clockRecordRepository = getRepository(ClockRecord);

    // 根据userId查找用户
    const user = await userRepository.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 获取当前时间和日期
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 检查今天是否已经打卡
    const existingClockRecord = await clockRecordRepository.findOne({ where: { user, date: today } });
    if (existingClockRecord) {
      throw new Error('Already clocked in today');
    }

    // 创建新的打卡记录
    const clockRecord = clockRecordRepository.create({
      user,
      date: today,
      ratedWorkStartTime: user.ratedWorkStartTime,
      ratedWorkEndTime: user.ratedWorkEndTime,
      clockInTime: now,
      ratedHourlyRate: user.ratedHourlyRate,
      ratedWorkHours: user.ratedWorkHours,
      ratedDailySalary: user.ratedDailySalary,
    });

    // 保存打卡记录
    await clockRecordRepository.save(clockRecord);

    // 返回打卡信息
    return {
      clockInTime: now,
      ratedWorkStartTime: user.ratedWorkStartTime || '' ,
      ratedWorkEndTime: user.ratedWorkEndTime || '' ,
      ratedHourlyRate: user.ratedHourlyRate || 0,
      ratedWorkHours: user.ratedWorkHours || 0,
      ratedDailySalary: user.ratedDailySalary || 0,
    };
  }

  /**
   * 用户下班打卡
   * @param userId 用户的 ID
   * @returns 打卡信息，包括打卡时间、总工作时长、实际收益和实际小时工资
   */
  async clockOut(userId: string): Promise<{
    clockOutTime: Date;
    actualWorkHours: number;
    expectedDailySalary: number;
    actualHourlyRate: number;
  }> {
    // 查找用户
    const userRepository = getRepository(User);
    const clockRecordRepository = getRepository(ClockRecord);
    const user = await userRepository.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 获取当前时间
    const now = new Date();
    // 获取当前日期
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 查找今天的打卡记录
    const clockRecord = await clockRecordRepository.findOne({ where: { user, date: today } });
    if (!clockRecord) {
      throw new Error('No clock-in record found for today');
    }

    // 检查是否已经下班打卡
    if (clockRecord.clockOutTime) {
      throw new Error('Already clocked out today');
    }

    // 计算工作统计数据
    const workStats = this.calculateWorkStats(clockRecord.clockInTime, now, user.ratedDailySalary || 0, user.ratedWorkHours || 0);

    // 更新打卡记录
    clockRecord.clockOutTime = now;
    clockRecord.actualWorkHours = workStats.actualWorkHours;
    clockRecord.actualHourlyRate = workStats.actualHourlyRate;
    clockRecord.expectedDailySalary = workStats.expectedDailySalary;

    // 保存更新后的打卡记录
    await clockRecordRepository.save(clockRecord);

    // 返回打卡信息
    return {
      clockOutTime: now,
      actualWorkHours: workStats.actualWorkHours,
      expectedDailySalary: workStats.expectedDailySalary,
      actualHourlyRate: workStats.actualHourlyRate,
    };
  }

  /**
   * 计算实际工作时间
   * @param startTime 预期开始时间
   * @param endTime 预期结束时间
   * @returns 预期工作小时数
   */
  private calculateActualWorkHours(startTime: string, endTime: string): number {
    // 创建日期对象以计算工作时间
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    // 计算并返回工作小时数
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  /**
   * 计算工作统计数据
   * @param clockInTime 上班打卡时间
   * @param clockOutTime 下班打卡时间
   * @param ratedDailySalary 额定日薪
   * @param ratedWorkHours 额定工作时长
   * @returns 工作时长、实际收益和实际小时工资
   */
  private calculateWorkStats(clockInTime: Date, clockOutTime: Date, ratedDailySalary: number, ratedWorkHours: number): {
    actualWorkHours: number;
    expectedDailySalary: number;
    actualHourlyRate: number;
  } {
    // 计算实际工作时长（小时）
    const actualWorkHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
    
    // 计算应得的当日收益
    // 根据实际工作时间与额定工作时间的比例，计算应得的薪资
    const expectedDailySalary = (actualWorkHours / ratedWorkHours) * ratedDailySalary;
    
    // 计算当天实际的小时工资（时薪）
    // 使用额定日薪除以实际工作时间
    const actualHourlyRate = ratedDailySalary / actualWorkHours;
    
    // 返回计算结果，保留两位小数
    return {
      actualWorkHours: Number(actualWorkHours.toFixed(2)),
      expectedDailySalary: Number(expectedDailySalary.toFixed(2)),
      actualHourlyRate: Number(actualHourlyRate.toFixed(2)),
    };
  }

  async getTodayClockRecord(userId: string): Promise<ClockRecord | null> {
    const userRepository = getRepository(User);
    const clockRecordRepository = getRepository(ClockRecord);

    const user = await userRepository.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const clockRecord = await clockRecordRepository.findOne({
      where: { user, date: today },
    });

    return clockRecord || null;
  }
}
