import { Request, Response, NextFunction } from 'express';

interface handleServiceParams {
    method: Function;
    res: Response;
    next: NextFunction;
    status?: number;
    arg: unknown;

}

interface ServiceResult {
    message: string;
    data: object;
}

interface ControllerParam {
  key: string;
}

export default abstract class Controller implements ControllerParam {
  key: string;

  constructor(key: string = 'main') {
    this.dispatchResponse = this.dispatchResponse.bind(this);
    this.handleService = this.handleService.bind(this);
    this.key = key;
  }

  handleService({
    method, res, next, status = 200, arg,
  }: handleServiceParams) {
    method(arg).then((data: ServiceResult) => {
      if (data != null) {
        res.locals[this.key] = data;
        res.status(status);
        next();
      } else next('Service error');
    })
      .catch(next);
  }

  dispatchResponse(req: Request, res: Response) {
    res.send({ status: 'success', ...res.locals[this.key] });
  }

  static sendMediaResponse({ files }: Request, res: Response, next: NextFunction) {
    if (files!.length === 0) {
      res.status(400);
      next({ isClient: true, response: { status: 'error', message: 'At least one file is required', data: { timestamp: new Date() } } });
    } else res.status(201).send({ status: 'success', message: 'File uploaded successfully', data: files });
  }
}

export { ControllerParam };
