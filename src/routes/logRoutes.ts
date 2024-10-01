// src/routes/logRoutes.ts
import express from 'express';
import { sendLog } from '../controllers/logController';
import { getReport } from '../controllers/reportController';
import { authenticate } from '../middleware/auth';
import { isAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/send', authenticate, sendLog);
router.get('/report', authenticate, isAdmin, getReport);

export default router;