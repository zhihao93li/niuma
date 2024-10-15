import { AuthService } from './authService';
import { User } from '../models/User';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 从环境变量中获取JWT密钥
const JWT_SECRET = process.env.JWT_SECRET;

// 本地认证服务类，实现AuthService接口
export class LocalAuthService implements AuthService {
  // 用户登录方法
  async login(credentials: { username: string; password: string }): Promise<{ success: boolean; token: string; user: User }> {
    const { username, password } = credentials;
    const userRepository = getRepository(User);

    console.log(`Attempting login for username: ${username}`);
    const user = await userRepository.findOne({ where: { username } });
    console.log(`User found:`, user);

    if (!user) {
      console.log(`Login failed: User not found`);
      throw new Error('Invalid username or password');
    }

    const passwordMatch = await this.comparePasswords(password, user.password!);
    console.log(`Password match: ${passwordMatch}`);

    if (!passwordMatch) {
      console.log(`Login failed: Invalid password`);
      throw new Error('Invalid username or password');
    }

    // 生成包含 authType 的 JWT 令牌
    const token = this.generateToken(user);
    console.log(`JWT token generated: ${token}`);

    return { success: true, token, user };
  }

  // 用户注册方法
  async register(credentials: { username: string; password: string }): Promise<{ success: boolean; token: string; user: User }> {
    const { username, password } = credentials;
    const userRepository = getRepository(User);
    // 检查用户名是否已存在
    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('Username already exists');
    }
    // 对密码进行哈希处理
    const hashedPassword = await bcrypt.hash(password, 10);
    // 创建新用户
    const newUser = userRepository.create({ username, password: hashedPassword, authType: 'local' });
    await userRepository.save(newUser);
    // 生成JWT token
    const token = this.generateToken(newUser);
    return { success: true, token, user: newUser };
  }

  // 验证JWT token
  async verifyToken(token: string): Promise<{ success: boolean; user: User }> {
    try {
      // 解码并验证token
      const decoded = jwt.verify(token, JWT_SECRET as string) as { id: string };
      const userRepository = getRepository(User);
      // 查找用户
      const user = await userRepository.findOne(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }
      return { success: true, user };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // 生成JWT token
  private generateToken(user: User): string {
    return jwt.sign({ id: user.id, authType: user.authType }, JWT_SECRET as string, { expiresIn: '1d' });
  }

  // 比较输入密码和存储的哈希密码
  private async comparePasswords(inputPassword: string, storedPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, storedPassword);
  }
}