import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('clock_records')
export class ClockRecord {
  // 记录的唯一标识符
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 关联的用户
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // 打卡日期
  @Column('date')
  date!: Date;

  // 上班打卡时间
  @Column({ name: 'clock_in_time', type: 'timestamp' })
  clockInTime!: Date;

  // 下班打卡时间（可为空）
  @Column({ name: 'clock_out_time', type: 'timestamp', nullable: true })
  clockOutTime?: Date;

  // 规定的工作开始时间
  @Column({ name: 'rated_work_start_time', type: 'time' })
  ratedWorkStartTime!: string;

  // 规定的工作结束时间
  @Column({ name: 'rated_work_end_time', type: 'time' })
  ratedWorkEndTime!: string;

  // 规定的小时工资率
  @Column('decimal', { name: 'rated_hourly_rate', precision: 10, scale: 4 })
  ratedHourlyRate!: number;

  // 实际的小时工资率（可为空）
  @Column('decimal', { name: 'actual_hourly_rate', precision: 10, scale: 4, nullable: true })
  actualHourlyRate?: number;

  // 规定的工作小时数
  @Column('decimal', { name: 'rated_work_hours', precision: 5, scale: 2 })
  ratedWorkHours!: number;

  // 实际的工作小时数（可为空）
  @Column('decimal', { name: 'actual_work_hours', precision: 5, scale: 2, nullable: true })
  actualWorkHours?: number;

  // 预期的日薪
  @Column('decimal', { name: 'expected_daily_salary', precision: 10, scale: 2 })
  expectedDailySalary!: number;

  // 规定的日薪
  @Column('decimal', { name: 'rated_daily_salary', precision: 10, scale: 2 })
  ratedDailySalary!: number;

  // 记录创建时间
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // 记录更新时间
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
