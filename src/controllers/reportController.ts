// src/controllers/reportController.ts
import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/reportService';
import { AppError } from '../middleware/errorHandler';

export const getReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;

    // Check if startDate and endDate are set
    if (!startDate || !endDate) {
      throw new AppError('startDate and endDate are required', 400);
    }

    if ((startDate && typeof startDate !== 'string') || (endDate && typeof endDate !== 'string')) {
      throw new AppError('Invalid date format', 400);
    }

    const report = await ReportService.generateReport(startDate, endDate);
    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};
