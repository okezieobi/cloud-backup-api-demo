import { Request, Response, NextFunction } from 'express';

import Controller from '.';
import FileServices from '../services/File';

interface FileControllerParams {
    Service: typeof FileServices;
    key: string;
}

export default class FileController extends Controller implements FileControllerParams {
  Service: typeof FileServices;

  constructor(Service = FileServices, key = 'file(s)') {
    super(key);
    this.Service = Service;
    this.saveFile = this.saveFile.bind(this);
  }

  saveFile({ body }: Request, res: Response, next: NextFunction) {
    const { saveFile } = new this.Service();
    return this.handleService({
      method: saveFile, res, next, status: 201, arg: { ...body, user: res.locals.user },
    });
  }
}
