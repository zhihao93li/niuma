// 导入所需的模块
import { User } from '../models/User';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();


export interface AuthService {
  login(credentials: any): Promise<{ success: boolean; token: string; user: User }>;
  verifyToken(token: string): Promise<{ success: boolean; user: User }>;
  register(credentials: any): Promise<{ success: boolean; token: string; user: User }>;
}
