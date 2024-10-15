import { getRepository } from 'typeorm';
import { User } from '../models/User';

export class UserService {
  /**
   * 设置用户的工作设置内容
   * @param userId 用户的ID
   * @param ratedDailySalary 用户的日薪
   * @param ratedWorkStartTime 工作开始时间
   * @param ratedWorkEndTime 工作结束时间
   * @returns 更新后的用户信息，如果更新失败则返回null
   */
  async setWorkSettings(userId: string, ratedDailySalary: number, ratedWorkStartTime: string, ratedWorkEndTime: string): Promise<User | null> {
    const userRepository = getRepository(User);
    
    const ratedHourlyRate = this.calculateHourlyRate(ratedDailySalary, ratedWorkStartTime, ratedWorkEndTime);
    const ratedWorkHours = this.calculateWorkHours(ratedWorkStartTime, ratedWorkEndTime);

    console.log('Searching for user with userId:', userId);  // 添加日志
    const user = await userRepository.findOne(userId);
    console.log('User found:', user);  // 添加日志

    if (!user) {
      console.log('User not found for userId:', userId);  // 添加日志
      return null;
    }

    user.ratedDailySalary = ratedDailySalary;
    user.ratedWorkStartTime = ratedWorkStartTime;
    user.ratedWorkEndTime = ratedWorkEndTime;
    user.ratedWorkHours = ratedWorkHours;
    user.ratedHourlyRate = ratedHourlyRate;

    return await userRepository.save(user);
  }

  /**
   * 计算小时工资率
   * @param dailySalary 日薪
   * @param startTime 工作开始时间
   * @param endTime 工作结束时间
   * @returns 计算得出的小时工资率
   */
  private calculateHourlyRate(dailySalary: number, startTime: string, endTime: string): number {
    // 创建日期对象以计算工作时间
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    // 计算工作小时数
    const workHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    // 计算并返回小时工资率，保留小数点后四位
    return Number((dailySalary / workHours).toFixed(4));
  }

  /**
   * 计算工作小时数
   * @param startTime 工作开始时间
   * @param endTime 工作结束时间
   * @returns 计算得出的工作小时数
   */
  private calculateWorkHours(startTime: string, endTime: string): number {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }
}
