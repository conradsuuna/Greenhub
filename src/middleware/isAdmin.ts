// src/middleware/isAdmin.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        isAdmin: boolean;
    };
}

export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Check if user exists on the request object
    if (!req.user) {
        return next(new AppError('Authentication required', 401));
    }

    // Check if the user has admin privileges
    if (!req.user.isAdmin) {
        return next(new AppError('Admin access required', 403));
    }

    // If the user is an admin, proceed to the next middleware/route handler
    next();
};