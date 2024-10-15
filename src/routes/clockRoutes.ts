import express from 'express';
import { authenticate } from '../middleware/auth';
import { clockIn, clockOut, getTodayClockRecord } from '../controllers/clockController';

const router = express.Router();

router.post('/clock-in', authenticate, clockIn);
router.post('/clock-out', authenticate, clockOut);
router.get('/today', authenticate, getTodayClockRecord);

export default router;
