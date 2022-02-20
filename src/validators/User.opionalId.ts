import { IsUUID, IsOptional } from 'class-validator';

interface OptionalUserParam {
    user?: string;
}

export default class OptionUserValidator implements OptionalUserParam {
  @IsUUID()
  @IsOptional()
    user?: string;

  constructor(user?: string) {
    this.user = user;
  }
}

export { OptionalUserParam };
