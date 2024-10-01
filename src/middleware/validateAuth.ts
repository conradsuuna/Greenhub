// src/middleware/validateAuth.ts
import { Request, Response, NextFunction } from 'express';
import { validateEmail, validatePassword } from '../utils/inputValidation';
import { AppError } from './errorHandler';

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Email and password are required', 400));
    }

    if (!validateEmail(email)) {
        return next(new AppError('Invalid email format', 400));
    }

    if (!validatePassword(password)) {
        return next(new AppError('Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, and 1 number', 400));
    }

    next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Email and password are required', 400));
    }

    if (!validateEmail(email)) {
        return next(new AppError('Invalid email format', 400));
    }

    // For login, we only check if the password is provided, not its format
    if (password.trim() === '') {
        return next(new AppError('Password cannot be empty', 400));
    }

    next();
};