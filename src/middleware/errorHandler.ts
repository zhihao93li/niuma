import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
});

// Error handler middleware
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // Log the error
  logger.error(err.message, { stack: err.stack });

  // Send error response
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
  });
}

// Function to log errors
export function logError(err: Error) {
  logger.error(err.message, { stack: err.stack });
}
