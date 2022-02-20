import { IsUUID } from 'class-validator';

interface IdParam {
    id: string;
}

export default class IdValidator implements IdParam {
    @IsUUID()
      id: string;

    constructor(id: string) {
      this.id = id;
    }
}
