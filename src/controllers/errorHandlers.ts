import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ValidationError } from 'class-validator';
import { MulterError } from 'multer';

import AppError from '../errors';

interface ResponseError extends Error {
    isClient: boolean;
    response: object;
}

const errorMarkers = {
  status: 'error',
  isClient: true,
  timestamp: new Date(),
};

const handleJwtError = (
  err: Error,
  { headers }: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    res.status(401);
    next({
      isClient: errorMarkers.isClient,
      response: {
        status: errorMarkers.status,
        message: err.message,
        data: {
          name: err.name,
          param: 'token',
          location: 'headers',
          value: headers.token,
          msg: 'Verification of jwt failed',
          timestamp: errorMarkers.timestamp,
        },
      },
    });
  } else next(err);
};

const handleEntityNotFoundErr = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof EntityNotFoundError) {
    res.status(404);
    const errMsg:string = err.message.replace(/\s+/g, ' ');
    next({
      isClient: errorMarkers.isClient,
      response: {
        status: errorMarkers.status,
        message: errMsg.replace(/[^\w\s]/gi, '').trim(),
        data: { type: 'EntityNotFoundError', timestamp: errorMarkers.timestamp },
      },
    });
  } else next(err);
};

const handleMulterErr = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    res.status(400);
    next({
      isClient: errorMarkers.isClient,
      response: {
        status: errorMarkers.status,
        message: err.message,
        data: { type: 'MulterError', ...err, timestamp: errorMarkers.timestamp },
      },
    });
  } else next(err);
};

const handleSQLValidationErr = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof QueryFailedError) {
    res.status(400);
    next({
      isClient: errorMarkers.isClient,
      response: {
        status: errorMarkers.status,
        message: err.message,
        data: { type: 'SQLQueryError', ...err.driverError, timestamp: errorMarkers.timestamp },
      },
    });
  } else next(err);
};

const handleValidationError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.constructor.name === 'ValidationError' || err[0] instanceof ValidationError) {
    res.status(400);
    next({
      isClient: errorMarkers.isClient,
      response: {
        status: errorMarkers.status,
        message: err.message ?? 'Validation failed',
        data: { type: 'ValidationError', ...err, timestamp: errorMarkers.timestamp },
      },
    });
  } else next(err);
};

const handleCustomError = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const error = { status: errorMarkers.status, message: err.message, data: err.data };
  switch (err.type) {
    case 'Argument':
      res.status(400);
      next({ isClient: errorMarkers.isClient, response: error });
      break;
    case 'Query':
      res.status(404);
      next({ isClient: errorMarkers.isClient, response: error });
      break;
    case 'Authorization':
      res.status(401);
      next({ isClient: errorMarkers.isClient, response: error });
      break;
    default:
      next(err);
  }
};

const dispatchClientError = ((
  err: ResponseError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.isClient) res.send(err.response);
  else next(err);
});

export default [
  handleJwtError,
  handleEntityNotFoundErr,
  handleMulterErr,
  handleSQLValidationErr,
  handleValidationError,
  handleCustomError,
  dispatchClientError];
