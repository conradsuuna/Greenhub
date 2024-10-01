// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AppError } from './errorHandler';
import { AuthenticatedRequest } from './isAdmin';
import { prisma } from '../utils/prisma';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(new AppError('No token provided', 401));
        }

        const token = authHeader.split(' ')[1]; // Bearer <token>
        const decoded = AuthService.verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, isAdmin: true }
        });

        if (!user) {
            return next(new AppError('User not found', 401));
        }

        (req as AuthenticatedRequest).user = {
            id: user.id,
            isAdmin: user.isAdmin
        };

        next();
    } catch (error) {
        next(new AppError('Invalid token', 401));
    }
};

export { isAdmin } from './isAdmin';