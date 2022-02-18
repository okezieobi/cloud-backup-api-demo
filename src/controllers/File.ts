import { Request, Response, NextFunction } from 'express';

import Controller from '.';
import FileServices from '../services/File';

interface FileControllerParams {
    Service: typeof FileServices;
    key: string;
}

export default class FileController extends Controller implements FileControllerParams {
  Service: typeof FileServices;

  constructor(Service = FileServices, key = 'files') {
    super(key);
    this.Service = Service;
    this.saveOne = this.saveOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.listAllForAdmin = this.listAllForAdmin.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
    this.verifyOneForAdmin = this.verifyOneForAdmin.bind(this);
  }

  saveOne({ body }: Request, res: Response, next: NextFunction) {
    const { saveOne } = new this.Service();
    return this.handleService({
      method: saveOne, res, next, status: 201, arg: { ...body, user: res.locals.user },
    });
  }

  listAll(req: Request, res: Response, next: NextFunction) {
    const { listAll } = new this.Service();
    return this.handleService({
      method: listAll, res, next, arg: { user: res.locals.user.id, isSafe: true },
    });
  }

  listAllForAdmin({ query: { user, isSafe } }: Request, res: Response, next: NextFunction) {
    const { listAll } = new this.Service();
    return this.handleService({
      method: listAll, res, next, arg: { user, isSafe: (`${isSafe}`.toLowerCase() === 'true') ?? true },
    });
  }

  verifyOne({ params: { id } }: Request, res: Response, next: NextFunction) {
    const { verifyOne } = new this.Service();
    return this.handleService({
      method: verifyOne, res, next, arg: { user: res.locals.user.id, id },
    });
  }

  verifyOneForAdmin({ params: { id } }: Request, res: Response, next: NextFunction) {
    const { verifyOne } = new this.Service();
    return this.handleService({
      method: verifyOne, res, next, arg: { id },
    });
  }

  static getOne(req: Request, res: Response, next: NextFunction) {
    res.locals.files = { message: 'File successfully retrieved', data: res.locals.files };
    next();
  }
}
