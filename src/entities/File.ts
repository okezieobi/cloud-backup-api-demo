import {
  Entity, Column,
} from 'typeorm';
import { IsBoolean, IsUUID } from 'class-validator';

import AppEntity from './Base';

Entity();
export default class FileEntity extends AppEntity {
  constructor(
    id: string,
    owner: string,
    isSafe: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    super(id, createdAt, updatedAt);
    this.owner = owner;
    this.isSafe = isSafe;
  }

    @Column({ type: 'uuid', nullable: false })
    @IsUUID()
      owner: string;

    @Column({ default: 'false', type: 'boolean' })
    @IsBoolean()
      isSafe: boolean;
}
