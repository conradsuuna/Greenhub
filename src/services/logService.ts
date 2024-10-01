import { prisma } from '../utils/prisma';
import { Log, LogLevel, Prisma } from '@prisma/client';

export class LogService {
  static async createLogs(userId: number, logs: Omit<Log, 'id' | 'userId' | 'hasLocalhostUrl'>[]): Promise<Prisma.BatchPayload> {
    const processedLogs = logs.map(log => ({
      ...log,
      userId,
      hasLocalhostUrl: this.checkForLocalhostUrl(log.text)
    }));

    return await prisma.log.createMany({
      data: processedLogs,
    });
  }

  private static checkForLocalhostUrl(text: string): boolean {
    return text.includes('http://localhost') || text.includes('https://localhost');
  }

  private static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  static validateLogMessage(log: any): boolean {
    return (
      typeof log === 'object' &&
      typeof log.timestamp === 'string' &&
      this.isValidDate(log.timestamp) &&
      this.isValidLogLevel(log.level) &&
      typeof log.text === 'string'
    );
  }

  private static isValidLogLevel(level: any): level is LogLevel {
    return Object.values(LogLevel).includes(level);
  }
}