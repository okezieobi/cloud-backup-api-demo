import {
  Entity, Column, ManyToOne,
} from 'typeorm';
import { IsBoolean } from 'class-validator';

import AppEntity from './Base';
import UserEntity from './User';

@Entity()
export default class FileEntity extends AppEntity {
  constructor(
    id: string,
    user: UserEntity,
    file: any,
    isSafe: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    super(id, createdAt, updatedAt);
    this.user = user;
    this.isSafe = isSafe;
    this.file = file;
  }

    @ManyToOne(() => UserEntity, (user) => user.files)
      user: UserEntity;

    @Column({ type: 'json' })
      file: any;

    @Column({ default: 'false', type: 'boolean' })
    @IsBoolean()
      isSafe: boolean;
}
