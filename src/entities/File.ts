import {
  Entity, Column, ManyToOne,
} from 'typeorm';
import { IsBoolean, IsArray, ArrayNotEmpty } from 'class-validator';

import AppEntity from './Base';
import UserEntity from './User';

@Entity()
export default class FileEntity extends AppEntity {
  constructor(
    id: string,
    user: UserEntity,
    info: object[],
    isSafe: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    super(id, createdAt, updatedAt);
    this.user = user;
    this.isSafe = isSafe;
    this.info = info;
  }

    @ManyToOne(() => UserEntity, (user) => user.files)
      user: UserEntity;

    @Column({ type: 'json', nullable: false })
    @IsArray()
    @ArrayNotEmpty()
      info: object[];

    @Column({ default: 'false', type: 'boolean' })
    @IsBoolean()
      isSafe: boolean;
}
