// src/services/reportService.ts
import { AppError } from '../middleware/errorHandler';
import { prisma } from '../utils/prisma';

export interface ReportData {
  startDate?: string;
  endDate?: string;
  warningCount: number;
  errorCount: number;
  infoCount: number;
  messageWithUrlCount: number;
}

export class ReportService {
  static async generateReport(startDate?: string, endDate?: string): Promise<ReportData> {
    if (startDate && !this.isValidDate(startDate)) {
      throw new AppError('Invalid startDate', 400);
    }
    if (endDate && !this.isValidDate(endDate)) {
      throw new AppError('Invalid endDate', 400);
    }

    const reportData: any = await prisma.$queryRaw`
      SELECT 
        COUNT(CASE WHEN level = 'warning' THEN 1 END) AS warningCount,
        COUNT(CASE WHEN level = 'error' THEN 1 END) AS errorCount,
        COUNT(CASE WHEN level = 'info' THEN 1 END) AS infoCount,
        COUNT(CASE WHEN "hasLocalhostUrl" = true THEN 1 END) AS messageWithUrlCount
      FROM "Log"
      WHERE (timestamp >= ${startDate}::timestamp AND timestamp <= ${endDate}::timestamp)
          `;

    return {
      startDate,
      endDate,
      warningCount: Number(reportData[0].warningcount),
      errorCount: Number(reportData[0].errorcount),
      infoCount: Number(reportData[0].infocount),
      messageWithUrlCount: Number(reportData[0].messagewithurlcount),
    };
  }
  
  private static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}
