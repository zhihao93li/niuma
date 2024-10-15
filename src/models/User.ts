import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  // 用户唯一标识符
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 微信用户的唯一标识
  @Column({ name: 'open_id', unique: true, nullable: true })
  openId?: string;

  // 用户名，用于本地认证
  @Column({ unique: true, nullable: true })
  username?: string;

  // 用户密码，用于本地认证
  @Column({ nullable: true })
  password?: string;

  // 认证类型：'wechat' 或 'local'
  @Column({ name: 'auth_type' })
  authType!: 'wechat' | 'local';

  // 用户设定的日薪
  @Column('decimal', { name: 'rated_daily_salary', precision: 10, scale: 2, nullable: true })
  ratedDailySalary?: number;

  // 用户设定的工作开始时间
  @Column({ name: 'rated_work_start_time', type: 'time', nullable: true })
  ratedWorkStartTime?: string;

  // 用户设定的工作结束时间
  @Column({ name: 'rated_work_end_time', type: 'time', nullable: true })
  ratedWorkEndTime?: string;

  // 用户的工作时长（小时）
  @Column('decimal', { name: 'rated_work_hours', precision: 5, scale: 2, nullable: true })
  ratedWorkHours?: number;

  // 根据日薪和工作时长计算的小时工资率
  @Column('decimal', { name: 'rated_hourly_rate', precision: 10, scale: 4, nullable: true })
  ratedHourlyRate?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
