import { validationResult } from 'express-validator';
import { asyncErrorHandler } from './ErrorHandler.js';  // Correct path and destructuring
import errorCodes from '../errors/ErrorCodes.js';
import ApplicationError from '../errors/ApplicationError.js'; // Importing ApplicationError

// Validation middleware
export const validation = asyncErrorHandler((req, res, next) => {
  const errors = validationResult(req);

  const { request_id } = req;

  if (errors.isEmpty()) {
    return next();
  }

  // Collect all error messages
  const messages = errors.array().map(error => error.msg);
  const errorMessage = messages.length > 1 ? messages.join(', ') : messages[0];

  const baseError = errorCodes['100006'];
  const error = { ...baseError, message: errorMessage, request_id };

  throw new ApplicationError(error);
});
