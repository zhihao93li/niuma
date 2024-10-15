import { AuthService } from './authService';
import { User } from '../models/User';
import { getRepository } from 'typeorm';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 从环境变量中获取微信应用ID、密钥和JWT密钥
const WECHAT_APP_ID = process.env.WECHAT_APP_ID;
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

// 微信认证服务类，实现AuthService接口
export class WechatAuthService implements AuthService {
  // 用户登录方法
  async login(credentials: { code: string }): Promise<{ success: boolean; token: string; user: User }> {
    // 通过微信code获取用户openId
    const { openId } = await this.getWechatUserInfo(credentials.code);
    const userRepository = getRepository(User);
    // 查找用户是否已存在
    let user = await userRepository.findOne({ where: { openId } });
    if (!user) {
      // 如果用户不存在，则注册新用户
      const { success, token, user: newUser } = await this.register({ openId });
      if (!success) {
        return { success: false, token: '', user: {} as User };
      }
      user = newUser;
    }
    // 生成JWT token
    const token = this.generateToken(user);
    return { success: true, token, user };
  }

  // 用户注册方法
  async register(credentials: { openId: string }): Promise<{ success: boolean; token: string; user: User }> {
    const userRepository = getRepository(User);
    // 创建新用户
    const newUser = userRepository.create({ openId: credentials.openId, authType: 'wechat' });
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

  // 从微信API获取用户信息
  private async getWechatUserInfo(code: string): Promise<{ openId: string }> {
    try {
      // 调用微信API获取openid
      const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
          appid: WECHAT_APP_ID,
          secret: WECHAT_APP_SECRET,
          js_code: code,
          grant_type: 'authorization_code'
        }
      });
      const { openid } = response.data;
      if (!openid) {
        throw new Error('Failed to get openid from Wechat API');
      }
      return { openId: openid };
    } catch (error) {
      console.error('Wechat API error:', error);
      throw new Error('Wechat authentication failed');
    }
  }

  // 生成JWT token
  private generateToken(user: User): string {
    return jwt.sign({ id: user.id, authType: 'wechat' }, JWT_SECRET as string, { expiresIn: '1d' });
  }
}
