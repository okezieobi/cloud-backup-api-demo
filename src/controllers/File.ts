import { Request, Response, NextFunction } from 'express';

import Controller, { ControllerParam } from '.';
import FileServices from '../services/File';

interface FileControllerParam extends ControllerParam {
    Service: typeof FileServices;
}

export default class FileController extends Controller implements FileControllerParam {
  Service: typeof FileServices;

  constructor(Service = FileServices, key = 'file(s)') {
    super(key);
    this.Service = Service;
    this.saveOne = this.saveOne.bind(this);
    this.listAll = this.listAll.bind(this);
    this.listAllForAdmin = this.listAllForAdmin.bind(this);
    this.verifyOne = this.verifyOne.bind(this);
    this.verifyOneForAdmin = this.verifyOneForAdmin.bind(this);
    this.updateSafeProp = this.updateSafeProp.bind(this);
  }

  saveOne({ body: { info } }: Request, res: Response, next: NextFunction) {
    const { saveOne } = new this.Service();
    return this.handleService({
      method: saveOne, res, next, status: 201, arg: { info, user: res.locals.user },
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
      method: listAll, res, next, arg: { user, isSafe: (`${isSafe}`.toLowerCase() === 'true') },
    });
  }

  verifyOne({ params: { id } }: Request, res: Response, next: NextFunction) {
    const { verifyOne } = new this.Service();
    return this.handleService({
      method: verifyOne, res, next, arg: { user: res.locals.user.id, id: id === ',' ? undefined : id },
    });
  }

  verifyOneForAdmin({ params: { id } }: Request, res: Response, next: NextFunction) {
    const { verifyOne } = new this.Service();
    return this.handleService({
      method: verifyOne, res, next, arg: { id: id === ',' ? undefined : id },
    });
  }

  updateSafeProp({ body: { isSafe } }: Request, res: Response, next: NextFunction) {
    const { updateSafeProp } = new this.Service();
    return this.handleService({
      method: updateSafeProp, res, next, arg: { isSafe: (`${isSafe}`.toLowerCase() === 'true'), file: res.locals['file(s)'] },
    });
  }

  static getOne(req: Request, res: Response, next: NextFunction) {
    res.locals.files = { message: 'File successfully retrieved', data: res.locals['file(s)'] };
    next();
  }
}
