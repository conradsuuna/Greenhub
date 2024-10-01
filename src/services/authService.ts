// src/services/authService.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { prisma } from '../utils/prisma';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET!;
  private static readonly JWT_EXPIRATION = '24h';

  static async registerUser(email: string, password: string): Promise<User> {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return user;
  }

  static async loginUser(email: string, password: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.generateToken(user);
    return token;
  }

  private static generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin
    };

    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRATION });
  }

  static verifyToken(token: string): jwt.JwtPayload {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as jwt.JwtPayload;
      return decoded;
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }
}
