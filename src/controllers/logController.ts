// src/controllers/logController.ts
import { Response, NextFunction } from 'express';
import { LogService } from '../services/logService';
import { AppError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/isAdmin';

export const sendLog = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { logs } = req.body;

    if (!Array.isArray(logs) || logs.length === 0) {
      throw new AppError('Invalid request body. Expected a non-empty array of log messages.', 400);
    }

    const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5 MB in bytes
    const MAX_LOG_SIZE = 200 * 1024; // 200 KB in bytes
    let totalSize = 0;
    const validLogs = [];
    const skippedLogs = [];

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      if (!LogService.validateLogMessage(log)) {
        throw new AppError(`Invalid log message at index ${i}`, 400);
      }

      const logSize = Buffer.byteLength(JSON.stringify(log), 'utf8');
      if (logSize > MAX_LOG_SIZE) {
        skippedLogs.push({ index: i, reason: 'Exceeds maximum log size' });
        continue;
      }

      totalSize += logSize;
      if (totalSize > MAX_TOTAL_SIZE) {
        skippedLogs.push({ index: i, reason: 'Total size limit reached' });
        break;
      }

      validLogs.push(log);
    }

    const createdLogs = await LogService.createLogs(userId, validLogs);
    
    res.status(200).json({
      message: 'Logs processed',
      submitted: logs.length,
      accepted: validLogs.length,
      skipped: skippedLogs,
      created: createdLogs.count
    });
  } catch (error) {
    next(error);
  }
};
