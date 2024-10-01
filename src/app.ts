// src/app.ts
import express from 'express';
import authRoutes from './routes/authRoutes';
import logRoutes from './routes/logRoutes';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/auth';

const app = express();

app.use(express.json());

// Public routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/logs', logRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;