import { IsUUID } from 'class-validator';

import OptionalUserValidator, { OptionalUserParam } from './User.opionalId';

interface VerifyOneParams extends OptionalUserParam {
  id: string;
}

export default class VerifyOneValidator extends OptionalUserValidator implements VerifyOneParams {
    @IsUUID()
      id: string;

    constructor(id: string, user?: string) {
      super(user);
      this.id = id;
    }
}

export { VerifyOneParams };
