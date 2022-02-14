import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

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

const errorHandlers = {
  handleJwtError(
    err: Error,
    { headers }: Request,
    res: Response,
    next: NextFunction,
  ) {
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
  },
  handleSQLValidationErr(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err.constructor.name === 'QueryFailedError') {
      res.status(400);
      next({
        isClient: errorMarkers.isClient,
        response: {
          status: errorMarkers.status,
          message: err.message,
          data: { timestamp: errorMarkers.timestamp },
        },
      });
    } else next(err);
  },
  handleValidationError(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err.constructor.name === 'ValidationError' || err.name === 'ValidationError') {
      res.status(400);
      next({
        isClient: errorMarkers.isClient,
        response: {
          status: errorMarkers.status,
          message: err.message,
          data: { ...err, timestamp: errorMarkers.timestamp },
        },
      });
    } else next(err);
  },
  handleCustomError(err: AppError, req: Request, res: Response, next: NextFunction) {
    const error = { status: errorMarkers.status, message: err.message, data: err.data };
    switch (err.data?.location) {
      case 'Argument':
        res.status(400);
        next({ isClient: errorMarkers.isClient, response: error });
        break;
      case 'Payment':
        res.status(400);
        next({ isClient: errorMarkers.isClient, response: error });
        break;
      case 'Query':
        res.status(404);
        next({ isClient: errorMarkers.isClient, response: error });
        break;
      case 'Validation':
        res.status(409);
        next({ isClient: errorMarkers.isClient, response: error });
        break;
      case 'Authorization':
        res.status(401);
        next({ isClient: errorMarkers.isClient, response: error });
        break;
      default:
        next(err);
    }
  },
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

export default [...Object.values(errorHandlers), dispatchClientError];