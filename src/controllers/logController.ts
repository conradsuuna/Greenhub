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

    logs.forEach((log, index) => {
      if (!LogService.validateLogMessage(log)) {
        throw new AppError(`Invalid log message at index ${index}`, 400);
      }
    });

    const createdLogs = await LogService.createLogs(userId, logs);
    res.status(200).json({ message: 'Logs submitted successfully', count: createdLogs.count });
  } catch (error) {
    next(error);
  }
};
