// src/routes/statsRoutes.ts
import express from 'express';
import { authenticate } from '../middleware/auth';
import { getHeatmapData } from '../controllers/statsController';

const router = express.Router();

router.get('/heatmap', authenticate, getHeatmapData);

export default router;

