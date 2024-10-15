import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/login', authController.login);
router.post('/verify', authController.verifyToken);
router.post('/register', authController.register);

export default router;
