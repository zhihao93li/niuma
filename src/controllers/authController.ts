import { Request, Response } from 'express';
import { WechatAuthService } from '../services/wechatAuthService';
import { LocalAuthService } from '../services/localAuthService';

const wechatAuthService = new WechatAuthService();
const localAuthService = new LocalAuthService();

export const login = async (req: Request, res: Response) => {
  try {
    const { authType, ...credentials } = req.body;
    const authService = authType === 'wechat' ? wechatAuthService : localAuthService;
    const result = await authService.login(credentials);
    res.json(result);
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ success: false, message: '登录失败' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { authType, ...credentials } = req.body;
    const authService = authType === 'wechat' ? wechatAuthService : localAuthService;
    const result = await authService.register(credentials);
    res.json(result);
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ success: false, message: '注册失败' });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const { token, authType } = req.body;
    const authService = authType === 'wechat' ? wechatAuthService : localAuthService;
    const result = await authService.verifyToken(token);
    res.json(result);
  } catch (error) {
    console.error('令牌验证错误:', error);
    res.status(500).json({ success: false, message: '令牌验证失败' });
  }
};