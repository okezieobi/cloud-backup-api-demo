import { IsBoolean } from 'class-validator';

import OptionalUserValidator, { OptionalUserParam } from './User.opionalId';

interface ListFilesParams extends OptionalUserParam {
  isSafe: boolean;
}

export default class ListFilesValidator extends OptionalUserValidator implements ListFilesParams {
    @IsBoolean()
      isSafe: boolean;

    constructor(isSafe: boolean, user?: string) {
      super(user);
      this.isSafe = isSafe;
    }
}

export { ListFilesParams };
