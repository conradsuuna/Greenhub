// src/utils/inputValidation.ts
import { AppError } from '../middleware/errorHandler';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const validateLogMessage = (log: any): boolean => {
  return (
    typeof log === 'object' &&
    typeof log.timestamp === 'string' &&
    ['info', 'warning', 'error'].includes(log.level) &&
    typeof log.text === 'string'
  );
};

export const validateInput = (input: any, validationFn: (input: any) => boolean, errorMessage: string) => {
  if (!validationFn(input)) {
    throw new AppError(errorMessage, 400);
  }
};