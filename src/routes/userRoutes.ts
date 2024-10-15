import express from 'express';
import { authenticate } from '../middleware/auth';
import { setWorkSettings } from '../controllers/userController';

const router = express.Router();

router.post('/settings', authenticate, setWorkSettings);

export default router;
