import { Request, Response, NextFunction } from 'express';
import { WechatAuthService } from '../services/wechatAuthService';
import { LocalAuthService } from '../services/localAuthService';
import { AuthService } from '../services/authService';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

// 工厂函数，根据 authType 返回相应的 AuthService 实例
function getAuthService(authType: 'wechat' | 'local'): AuthService {
  if (authType === 'wechat') {
    return new WechatAuthService();
  } else if (authType === 'local') {
    return new LocalAuthService();
  } else {
    throw new Error('Invalid auth type');
  }
}

// 中间件，用于验证 JWT
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authentication failed: Missing or invalid Authorization header');
    res.status(401).json({ success: false, message: '未授权访问' });
    return;
  }

  const token = authHeader.split(' ')[1];
  let authType: 'wechat' | 'local';

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; authType: 'wechat' | 'local' };
    console.log(`Decoded JWT:`, decoded);
    authType = decoded.authType;
    const authService = getAuthService(authType);
    const result = await authService.verifyToken(token);
    if (result.success) {
      console.log(`Authentication successful for userId: ${result.user.id}`);
      (req as any).userId = result.user.id;
      next(); // 确保调用 next() 以继续处理请求
    } else {
      console.log(`Authentication failed: Verification failed`);
      res.status(401).json({ success: false, message: '验证失败' });
    }
  } catch (error) {
    console.log(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(401).json({ success: false, message: '无效的令牌' });
  }
};